using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using IFD.Logging;
using CifwCocon.ImportBiz.Common;
using CifwCocon.ImportBiz.Common.Sftp;
using CifwCocon.ImportBiz.Common.Sftp.Model;
using Cifw.Core.Ftp;
using CifwCocon.ImportRepo;
using CifwCocon.ImportRepo.Entities;
using Microsoft.Extensions.Configuration;
using Renci.SshNet;
using CifwCocon.NetworkInformation.Biz.Notification;

namespace CifwCocon.ImportBiz
{
    public interface IImportAddressService
    {
        /// <summary>
        /// SFTP protocol
        /// </summary>
        //void DoImportation();
        /// <summary>
        /// FTP protocol
        /// </summary>
        void DoImportationByFtp();
    }
    public partial class ImportAddressService : IImportAddressService
    {
        private readonly INotificationService _notificationService;
        private readonly ILogger _logger;
        public readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _delimiter;
        private readonly string tableStaging = "addressstaging";
        private readonly int _mode;
        private readonly IFtpService _ftpService;
        private readonly Dictionary<string, string> _columnsMapping;
        private readonly int _timeOut;
        private List<string> _columnsReadFromCsv;
        private int csvTotalRows = 0;
        private int dbTotalRows = 0;
        private readonly int _percentRowsComparion = 0;

        public ImportAddressService(IConfiguration configuration, ILogger logger, IFtpService ftpService, INotificationService notificationService)
        {
            _notificationService = notificationService;
            _configuration = configuration;
            _logger = logger;
            _ftpService = ftpService;
            _connectionString = _configuration["Data:CifwCocon2018DbContextDevelopment:ConnectionString"];
            _delimiter = _configuration["delimiter"];
            int.TryParse(_configuration["Mode"], out _mode);
            var csvColumnConfiguration = _configuration["columnCsv"].Split(_delimiter).ToList();
            csvColumnConfiguration.Add("lineCsv");
            var dataColumnConfiguration = _configuration["columnData"].Split(_delimiter).ToList();
            dataColumnConfiguration.Add("lineCsv");
            _columnsMapping = csvColumnConfiguration.Zip(dataColumnConfiguration, (k, v) => new { k, v }).ToDictionary(x => x.k, x => x.v);
            int.TryParse(configuration["timeoutDatabase"], out _timeOut);
            if (_timeOut == 0) _timeOut = 120;
            int.TryParse(_configuration["percentRows"], out _percentRowsComparion);
        }
        private void AddLog(string fileName, bool status)
        {
            using (var db = new CifwCocon2018DbContext(_connectionString))
            {
                var fileNameWithoutExt = Path.GetFileName(fileName).Replace("\\", "");
                var fileLog = db.FileLogses.FirstOrDefault(s => s.Name == fileNameWithoutExt);
                if (fileLog != null)
                {
                    fileLog.IsImported = status;
                }
                else
                {
                    db.FileLogses.Add(new FileLogs
                    {
                        Name = fileNameWithoutExt,
                        IsImported = status
                    });
                }
                db.SaveChanges();
            }
        }
        private bool BulkInsert(DataTable dt, string fileName)
        {
            var result = true;
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    var bulkCopy = new SqlBulkCopy(connection, SqlBulkCopyOptions.TableLock | SqlBulkCopyOptions.FireTriggers | SqlBulkCopyOptions.UseInternalTransaction, null) { DestinationTableName = tableStaging };
                    foreach (var item in _columnsMapping)
                    {
                        if (_columnsReadFromCsv.Contains(item.Key))
                        {
                            bulkCopy.ColumnMappings.Add(item.Key, item.Value);
                        }
                    }
                    bulkCopy.ColumnMappings.Add("lineCsv", "lineCsv");
                    // set the destination table name  lineCsv
                    connection.Open();
                    // write the data in the "dataTable"
                    bulkCopy.BulkCopyTimeout = _timeOut;
                    bulkCopy.WriteToServer(dt);
                    connection.Close();
                }
            }
            catch (Exception e)
            {
                _logger.Error("Bulk insert csv error: ", e);
                _notificationService.RequestNotification(dbTotalRows, _configuration["NotificationFailedForImportLocaCache"], _configuration["TitleNotificationFailedForImportLocaCache"], e.Message, fileName);
                return false;
            }
            return result;
        }
        public DataTable GetDataTabletFromCsvFile(string csvFilePath, string delimiter)
        {
            var csvData = new DataTable();

            var index = 2;
            try
            {
                using (var fileReader = new StreamReader(csvFilePath))
                {
                    var colFields = fileReader.ReadLine()?.SplitCsvRow(delimiter);
                    _columnsReadFromCsv = colFields?.ToList();
                    if (colFields != null)
                    {
                        foreach (string column in colFields)
                        {
                            //check value of column is date format (need for mapping data to DB)
                            var datacolumn = new DataColumn(column) { AllowDBNull = true };
                            csvData.Columns.Add(datacolumn);
                        }
                        var lineCsvColumn = new DataColumn
                        {
                            DataType = typeof(int),
                            AllowDBNull = true,
                            ColumnName = "lineCsv"
                        };
                        csvData.Columns["HASdatum"].DataType = typeof(DateTime);
                        csvData.Columns.Add(lineCsvColumn);
                    }

                    var rowsInvalid = new List<dynamic>();
                    while (!fileReader.EndOfStream)
                    {
                        //read data csv
                        var fieldData = fileReader.ReadLine()?.SplitCsvRow(delimiter);
                        if (fieldData == null || fieldData.Length == 0)
                        {
                            dynamic item = new ExpandoObject();
                            item.row = index;
                            item.message = "Row is empty";
                            item.csvContent = null;
                            rowsInvalid.Add(item);
                            index++;
                            continue;
                        }
                        if (fieldData.Length != colFields?.Length)
                        {
                            dynamic item = new ExpandoObject();
                            item.row = index;
                            item.message = "Row is invalid column";
                            item.csvContent = string.Join(delimiter, fieldData);
                            rowsInvalid.Add(item);
                            index++;
                            continue;
                        }
                        if (!ValidateZipcode(fieldData[0]))
                        {
                            dynamic item = new ExpandoObject();
                            item.row = index;
                            item.message = "Row is invalid Zipcode";
                            item.csvContent = string.Join(delimiter, fieldData);
                            rowsInvalid.Add(item);
                            index++;
                            continue;
                        }
                        if (string.IsNullOrEmpty(fieldData[1]))
                        {
                            dynamic item = new ExpandoObject();
                            item.row = index;
                            item.message = "Row missing HouseNumber";
                            item.csvContent = string.Join(delimiter, fieldData);
                            rowsInvalid.Add(item);
                            index++;
                            continue;
                        }
                        var arrObj = new object[csvData.Columns.Count];
                        for (var i = 0; i < csvData.Columns.Count - 1; i++)
                        {
                            if (string.IsNullOrEmpty(fieldData[i]))
                            {
                                arrObj[i] = null;
                            }
                            else if (csvData.Columns[i].ColumnName == "HASdatum")
                            {
                                DateTime.TryParseExact(fieldData[i], "d-M-yyyy H:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out var hasDatum);
                                arrObj[i] = hasDatum;
                            }
                            else
                            {
                                arrObj[i] = fieldData[i];
                            }
                        }
                        arrObj[csvData.Columns.Count - 1] = index;
                        csvData.Rows.Add(arrObj);
                        index++;
                    }
                    //Collect rows invalid
                    if (rowsInvalid.Any())
                    {
                        csvTotalRows = rowsInvalid.Count();
                        var fileName = Path.GetFileName(csvFilePath);
                        Dictionary<string, string> tags;
                        foreach (var item in rowsInvalid)
                        {
                            tags = new Dictionary<string, string>
                            {
                                { "FileName",  fileName},
                                { "Row",  item.row.ToString()},
                                { "OriginCsvContent",  item.csvContent.ToString()}
                            };
                            _logger.SetAdditionalCorrelations(tags);
                            _logger.Warn(item.message.ToString());
                        }

                        tags = new Dictionary<string, string>
                        {
                            { "Row",  null},
                            { "OriginCsvContent",  null},
                            { "FileName",  null}
                        };
                        _logger.SetAdditionalCorrelations(tags);
                    }
                }
            }
            catch (Exception exception)
            {
                _logger.Error("Get data from Csv error. ", exception);
            }
            return csvData;
        }
        public Hashtable ConnectSftpAndDownFiles(SftpInfo sftpInfo, string remotePath, string saveFilePath, List<string> filesImported = null)
        {
            var listStream = new Hashtable();
            SftpClient sftpClient = null;
            try
            {
                var fileType = _configuration["fileType"]?.Split(';');
                _logger.Info("Connect to  SFTP - Begin");
                sftpClient = SftpUtils.Connect(sftpInfo);
                if (sftpClient == null)
                {
                    _logger.Warn("Cannot connect to  SFTP");
                    return null;
                }
                //download files from SFTP server
                listStream = SftpUtils.DownloadFiles(sftpClient, saveFilePath, remotePath, fileType, filesImported);
                _logger.Info("Connect to  SFTP - End");
                return listStream;
            }
            catch (Exception ex)
            {
                _logger.Error("DowloadFile from SFTP error. ", ex);
                return listStream;
            }
            finally
            {
                // close Xenosite SFTP connection
                if (sftpClient != null && sftpClient.IsConnected)
                {
                    sftpClient.Disconnect();
                    sftpClient.Dispose();
                }
            }
        }
        private void MoveFileToBackup(FileInfo fileInfo)
        {
            try
            {
                var pathBackupFolder = $"{Path.GetDirectoryName(fileInfo.FullName)}/backup";
                if (!Directory.Exists(pathBackupFolder))
                {
                    Directory.CreateDirectory(pathBackupFolder);
                }
                //check exited file in backup folder
                var pathFileBackup = $"{Path.GetDirectoryName(fileInfo.FullName)}/backup/{fileInfo.Name}";
                if (File.Exists(pathFileBackup))
                {
                    File.Delete(pathFileBackup);
                }
                // To move a file or folder to a new location:
                File.Move(fileInfo.FullName, $"{pathBackupFolder}/{fileInfo.Name}");
            }
            catch (Exception ex)
            {
                _logger.Error("Move file failed:", ex);
            }
        }
        private bool ValidateZipcode(string zipcode)
        {
            if (string.IsNullOrWhiteSpace(zipcode)) return false;
            var regex = new Regex(@"[0-9]{4}[A-Z]{2}$");
            return regex.IsMatch(zipcode);
        }
    }
}
