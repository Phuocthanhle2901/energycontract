using System;
using System.IO;
using System.Linq;
using CifwCocon.ImportRepo;
using CifwCocon.NetworkInformation.Biz.Notification;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CifwCocon.ImportBiz
{
    public partial class ImportAddressService
    {
        public void DoImportationByFtp()
        {
            try
            {
                _ftpService.Initial();
                using (var context = new CifwCocon2018DbContext(_connectionString))
                {
                    var importedFiles = context.FileLogses.Where(s => s.IsImported).Select(s => s.Name).ToList();
                    var totalDbBefore = context.CoconAddresses.Count();
                    var files = _ftpService.DownloadFile(importedFiles);
                    if (files == null || !files.Any())
                    {
                        _logger.Warn("There were no file downloaded from ftp server");
                        _notificationService.RequestNotification(dbTotalRows, _configuration["NotificationFailedForImportLocaCache"], _configuration["TitleNotificationFailedForImportLocaCache"], "There were no file downloaded from ftp server", "file");
                        return;
                    }
                    foreach (string file in files)
                    {
                        var fileInfo = new FileInfo(file);
                        var fileName = fileInfo.Name.Replace("\\", "");
                        _logger.Info($"Start import {fileInfo.Name} file!");
                        AddLog(file, true);
                        try
                        {
                            var dataFromCsv = GetDataTabletFromCsvFile(fileInfo.FullName, _delimiter);
                            dbTotalRows = dataFromCsv.Rows.Count;
                            int rowsInvalid = csvTotalRows;
                            csvTotalRows = csvTotalRows + dbTotalRows;

                            //if records in file < 90% ( rows in database ) --> not import
                            if (totalDbBefore > 0 && csvTotalRows > 0)
                            {
                                var percentRows = (int)(((double)csvTotalRows / totalDbBefore) * 100);
                                if (percentRows < _percentRowsComparion)
                                {
                                    _logger.Warn($"Records in file {fileName}/database : {csvTotalRows}/{totalDbBefore} = {percentRows} : < {_percentRowsComparion}% ( rows in database)");
                                    throw new Exception($"Records in file {fileName}/database : {csvTotalRows}/{totalDbBefore} = {percentRows} : < {_percentRowsComparion}% ( rows in database)");
                                }
                            }
                            var insertedCsvToDb = BulkInsert(dataFromCsv, fileName);

                            if (insertedCsvToDb)
                            {
                                try
                                {
                                    _logger.Info("Start merge.");
                                    context.Database.SetCommandTimeout(_timeOut);
                                    context.Database.ExecuteSqlCommand($"exec mergeADDRESStoMAINtable {_mode}");
                                    dbTotalRows = context.CoconAddresses.Count();
                                    _logger.Info($"rows in {fileInfo.Name}: {csvTotalRows}, rows invalid: {rowsInvalid},Total row of database before running job: {totalDbBefore} , Total row of database after  running job: {dbTotalRows}");
                                    _logger.Info("Finish merge.");
                                    _notificationService.RequestNotification(dbTotalRows, _configuration["NotificationForImportLocaCache"], $"{_configuration["TitleNotificationForImportLocaCache"]}: {fileName}", csvTotalRows.ToString(), fileName, rowsInvalid.ToString(), totalDbBefore.ToString());
                                }
                                catch (Exception e)
                                {
                                    AddLog(file, false);
                                    _logger.Error("Merge errors: ", e);
                                    _notificationService.RequestNotification(dbTotalRows, _configuration["NotificationFailedForImportLocaCache"], _configuration["TitleNotificationFailedForImportLocaCache"], e.Message, fileName);
                                    throw;
                                }
                            }
                        }
                        catch (Exception exception)
                        {
                            _logger.Error($"File {fileInfo.Name} occur errors. ", exception);
                            AddLog(fileInfo.Name, false);
                            _notificationService.RequestNotification(dbTotalRows, _configuration["NotificationFailedForImportLocaCache"], _configuration["TitleNotificationFailedForImportLocaCache"], exception.Message, fileName);
                            throw;
                        }
                        finally
                        {
                            var truncateaddressstagingsql = $"TRUNCATE TABLE {tableStaging}";
                            context.Database.ExecuteSqlCommand(truncateaddressstagingsql);
                        }
                        MoveFileToBackup(fileInfo);
                        _logger.Info($"Finish import {fileInfo.Name} file!");
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                _ftpService.Dispose();
            }
        }
    }
}
