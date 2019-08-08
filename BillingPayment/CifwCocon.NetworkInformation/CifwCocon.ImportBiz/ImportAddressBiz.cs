using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using CifwCocon.ImportBiz.Common;
using CifwCocon.ImportBiz.Common.Sftp;
using CifwCocon.ImportBiz.Common.Sftp.Model;
using CifwCocon.ImportBiz.Logging;
using CifwCocon.ImportRepo;
using CifwCocon.ImportRepo.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Renci.SshNet;
using Cifw.Core.Enums;

namespace CifwCocon.ImportBiz
{
    public class ImportAddressBiz
    {
        private static readonly ILogger Logger = LoggingFactory.GetsLogger();
        private static string _delimiter;
        private static IConfiguration Configuration { get; set; }
        private readonly string _connectionString;
        private readonly string _keyConfiguration;
        private readonly string _runMode;
        private int _numberRowPerInsert;
        /// <summary>
        /// Define column map with index row csv
        /// </summary>
        public Dictionary<string, int> ColumnsMapping { get; } = new Dictionary<string, int>();
        public ImportAddressBiz(IConfiguration configuration)
        {
            Configuration = configuration;
            _connectionString = Configuration["Data:CifwCocon2018DbContextDevelopment:ConnectionString"];
            _keyConfiguration = Configuration["keyConfiguration"];
            _runMode = Configuration["Mode"];
        }
        public void CoconProcesses()
        {
            try
            {
                _numberRowPerInsert = !string.IsNullOrEmpty(Configuration["numberRowPerInsert"]) ? int.Parse(Configuration["numberRowPerInsert"]) : 200;
            }
            catch (Exception)
            {
                Logger.Warn("Key [numberRowPerInsert] is invalid. Import with default value : 200");
                _numberRowPerInsert = 200;
            }

            var index = 1;
            var currentFile = string.Empty;
            var currentRow = string.Empty;
            try
            {
                Logger.Info("Start import proccess!");
                using (var context = new CifwCocon2018DbContext(_connectionString))
                {
                    if (string.IsNullOrEmpty(_keyConfiguration))
                    {
                        Logger.Error("Key Configuration in appsetting is not defined");
                        return;
                    }
                    var config = context.Configurations.FirstOrDefault(s => s.Key.ToUpper() == _keyConfiguration);
                    if (string.IsNullOrEmpty(config?.Value))
                    {
                        Logger.Error("Configuration is not defined");
                        return;
                    }
                    var sftpConfigs = Newtonsoft.Json.JsonConvert.DeserializeObject<List<SftpInfo>>(config.Value);
                    foreach (var sftpConfig in sftpConfigs)
                    {
                        if (sftpConfig.IsActive)
                        {
                            if (string.IsNullOrEmpty(sftpConfig.Host) ||
                                string.IsNullOrEmpty(sftpConfig.UserName) ||
                                string.IsNullOrEmpty(sftpConfig.Password) ||
                                string.IsNullOrEmpty(sftpConfig.DownloadPath) ||
                                string.IsNullOrEmpty(sftpConfig.SavePath) ||
                                string.IsNullOrEmpty(sftpConfig.Delimiter) ||
                                sftpConfig.Port == 0)
                            {
                                Logger.Error("Configuration is missing");
                                return;
                            }
                            _delimiter = sftpConfig.Delimiter;
                            var sftpInfo = SftpUtils.InitSftpInfo(sftpConfig.Host, sftpConfig.Port, sftpConfig.UserName, sftpConfig.Password);
                            //Get all files is imported(log).
                            var filesImported = context.FileLogses.Where(s => s.IsImported).Select(s => s.Name).ToList();
                            //Get all files in SFTP
                            var files = ConnectSftpAndDownFiles(sftpInfo, sftpConfig.DownloadPath, sftpConfig.SavePath, filesImported);
                            //Cast Hashtable to OrderedEnumrable<string>
                            var keys = files.Keys.Cast<string>().OrderBy(s => s);
                            foreach (string file in keys)
                            {
                                currentFile = Path.GetFileName(file);
                                Logger.Info($"Start import {currentFile} file!");
                                //update file imported status
                                AddLog(file, true);
                                Logger.Info($"{currentFile} added to FileLogs");
                                //Reset index
                                index = 2;
                                var fileInfo = new FileInfo(file);
                                var coconAddresses = new List<CoconAddress>();
                                using (var reader = new StreamReader(fileInfo.FullName))
                                {
                                    MappingHeader(reader.ReadLine());
                                    while (!reader.EndOfStream)
                                    {
                                        try
                                        {
                                            var row = reader.ReadLine();
                                            currentRow = row;
                                            if (!string.IsNullOrEmpty(row))
                                            {
                                                row = row.Replace("\"", "");
                                                var data = row.Split(_delimiter);
                                                var coconAddress = BindingData(data);
                                                if (coconAddress == null)
                                                {
                                                    Logger.Error($"File Name {currentFile}, Row {index} is invalid");
                                                    Logger.Error(row);
                                                }
                                                else
                                                {
                                                    var validateObjectResult = ValidateObject(coconAddress);
                                                    if (!string.IsNullOrEmpty(validateObjectResult))
                                                    {
                                                        Logger.Error($"File Name {currentFile}, Row {index} is invalid({validateObjectResult})");
                                                        Logger.Error(row);
                                                    }
                                                    else
                                                    {
                                                        
                                                        if(_runMode == "1") //Check existed addresses in file and db
                                                        {
                                                            var houseNoExt = coconAddress.HousenumberExt ?? string.Empty;
                                                            var room = coconAddress.Room ?? string.Empty;
                                                            //Address get from db
                                                            var addressInDb = context.CoconAddresses.Include(s => s.CoconAddressFibersPartieses).ThenInclude(s => s.CoconAddressFiber).Include(s => s.CoconAddressFibersPartieses).ThenInclude(s => s.CoconAddressParty)
                                                                                .FirstOrDefault(s => s.Zipcode == coconAddress.Zipcode && s.HouseNumber == coconAddress.HouseNumber &&
                                                                                                    (houseNoExt == string.Empty ? s.HousenumberExt == null || s.HousenumberExt == string.Empty : s.HousenumberExt == houseNoExt) &&
                                                                                                    (room == string.Empty ? s.Room == null || s.Room == string.Empty : s.Room == room));
                                                            //Not exists in db => create new address
                                                            if (addressInDb == null)
                                                            {
                                                                var localAddress = coconAddresses.FirstOrDefault(s => s.Zipcode == coconAddress.Zipcode &&
                                                                                    s.HouseNumber == coconAddress.HouseNumber &&
                                                                                    (houseNoExt == string.Empty ? s.HousenumberExt == null || s.HousenumberExt == string.Empty : s.HousenumberExt == houseNoExt) &&
                                                                                    (room == string.Empty ? s.Room == null || s.Room == string.Empty : s.Room == room));
                                                                if (localAddress != null)
                                                                {
                                                                    coconAddresses.Remove(localAddress);
                                                                }
                                                                coconAddresses.Add(coconAddress);
                                                            }
                                                            //Update address if exists
                                                            else
                                                            {
                                                                Mapping(coconAddress, addressInDb);
                                                            }
                                                        }
                                                        else //Insert as new data
                                                        {
                                                            coconAddresses.Add(coconAddress);
                                                        }

                                                    }
                                                }
                                            }
                                            if (index % _numberRowPerInsert == 0)
                                            {
                                                context.CoconAddresses.AddRange(coconAddresses);
                                                coconAddresses.Clear();
                                                context.SaveChanges();
                                            }
                                        }
                                        catch(Exception ex)
                                        {
                                            Logger.Error($"File Name {currentFile}, Row {index} is invalid", ex);
                                        }

                                        index++;
                                    }
                                }
                                context.CoconAddresses.AddRange(coconAddresses);
                                context.SaveChanges();
                                ColumnsMapping.Clear();
                                //update file imported status
                                AddLog(file, true);
                                Logger.Info($"Finish import {currentFile} file!");
                                
                                //Move file to backup folder local
                                MoveFileToBackup(fileInfo);
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Info($"File Name: {currentFile}");
                Logger.Info($"Row: {index}");
                Logger.Info(currentRow);
                Logger.Error($"Import proccess was teminated. Cause by: {e.Message}", e);
                AddLog(currentFile, false);
                Logger.Info($"{currentFile} rollbacked");
            }
            finally
            {
                Logger.Info("Finish import proccess!");
            }
        }

        private static void Mapping(CoconAddress coconAddress, CoconAddress addressInDb)
        {
            MappingWithExistsRow(coconAddress, addressInDb);
            //Mapping data from csv with db
            //Case object(party) modified
            for (int i = 0; i < coconAddress.CoconAddressFibersPartieses.Count; i++)
            {
                if (coconAddress.CoconAddressFibersPartieses.Count != addressInDb.CoconAddressFibersPartieses.Count)
                {
                    if (coconAddress.CoconAddressFibersPartieses.Count > addressInDb.CoconAddressFibersPartieses.Count)
                    {
                        for (int j = addressInDb.CoconAddressFibersPartieses.Count;
                            j < coconAddress.CoconAddressFibersPartieses.Count;
                            j++)
                        {
                            addressInDb.CoconAddressFibersPartieses.Add(
                                coconAddress.CoconAddressFibersPartieses.ToList()[j]);
                        }
                    }
                    else
                    {
                        for (int j = addressInDb.CoconAddressFibersPartieses.Count;
                            j < coconAddress.CoconAddressFibersPartieses.Count;
                            j++)
                        {
                            addressInDb.CoconAddressFibersPartieses.ToList()[j].IsDelete = true;
                        }
                    }
                }
                else
                {
                    if (coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressFiber == null && addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressFiber != null)
                    {
                        addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressFiber.IsDelete = true;
                    }
                    else if (addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressFiber == null && coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressFiber != null)
                    {
                        addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressFiber = coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressFiber;
                    }
                    else
                    {
                        MappingWithExistsRow(coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressFiber, addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressFiber);
                    }

                    if (coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty == null && addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty != null)
                    {
                        addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty.IsDelete = true;
                    }
                    else if (addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty == null && coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty != null)
                    {
                        addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty = coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty;
                    }
                    else
                    {
                        MappingWithExistsRow(coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty, addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty);
                        if (addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty != null &&
                            coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty != null)
                        {
                            addressInDb.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty.PartyTypeId =
                                coconAddress.CoconAddressFibersPartieses.ToList()[i].CoconAddressParty.PartyTypeId;
                        }
                    }
                }
            }
        }
        private void MappingHeader(string row)
        {
            if (!string.IsNullOrEmpty(row))
            {
                var columns = row.Trim('\\').Split(_delimiter);
                if (columns.Length > 0)
                {
                    ColumnsMapping.Add("Zipcode", 0);
                    ColumnsMapping.Add("HouseNumber", 1);
                    ColumnsMapping.Add("HouseNumberExt", 2);
                    ColumnsMapping.Add("Room", 3);

                    ColumnsMapping.Add("AreaNumber", 4);
                    ColumnsMapping.Add("ContractArea", 5);

                    ColumnsMapping.Add("HUDEER1", 6);
                    ColumnsMapping.Add("HUDEERAREA1", 7);
                    ColumnsMapping.Add("BEHEDDER1", 8);
                    ColumnsMapping.Add("BEHEDDERAREA1", 9);

                    ColumnsMapping.Add("HUDEER2", 10);
                    ColumnsMapping.Add("HUDEERAREA2", 11);
                    ColumnsMapping.Add("BEHEDDER2", 12);
                    ColumnsMapping.Add("BEHEDDERAREA2", 13);


                    ColumnsMapping.Add("DeliveryClass", 14);
                    ColumnsMapping.Add("ConnectionStatus", 15);
                    ColumnsMapping.Add("CommentsOnDeliveryClass", 16);
                    ColumnsMapping.Add("HasBegin", 17);
                    ColumnsMapping.Add("FtuType", 18);
                    ColumnsMapping.Add("AreaCode", 19);
                    ColumnsMapping.Add("SingleChangeCode", 20);
                    ColumnsMapping.Add("RedemtionCode", 21);
                    ColumnsMapping.Add("Purchased", 22);



                    ColumnsMapping.Add("Closet1", 25);
                    ColumnsMapping.Add("Row1", 24);
                    ColumnsMapping.Add("Position1", 27);
                    ColumnsMapping.Add("Port1", 28);
                    ColumnsMapping.Add("PopShelf1", 26);
                    ColumnsMapping.Add("LocationName1", 23);

                    ColumnsMapping.Add("OrderType1", 29);
                    ColumnsMapping.Add("ActiveOperator1", 30);
                    ColumnsMapping.Add("OrderId1", 31);
                    ColumnsMapping.Add("ActiveOrderTypePlanned1", 32);
                    ColumnsMapping.Add("ActiveOperatorPlanned1", 33);
                    ColumnsMapping.Add("ActiveOperatorOrderIdPlanned1", 34);


                    ColumnsMapping.Add("Closet2", 37);
                    ColumnsMapping.Add("Row2", 36);
                    ColumnsMapping.Add("Position2", 39);
                    ColumnsMapping.Add("Port2", 40);
                    ColumnsMapping.Add("PopShelf2", 38);
                    ColumnsMapping.Add("LocationName2", 35);

                    ColumnsMapping.Add("OrderType2", 41);
                    ColumnsMapping.Add("ActiveOperator2", 42);
                    ColumnsMapping.Add("OrderId2", 43);
                    ColumnsMapping.Add("ActiveOrderTypePlanned2", 44);
                    ColumnsMapping.Add("ActiveOperatorPlanned2", 45);
                    ColumnsMapping.Add("ActiveOperatorOrderIdPlanned2", 46);
                }
            }
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
        private static void MoveFileToBackup(FileInfo fileInfo)
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
                Logger.Error("Move file failed:", ex);
            }
        }
        private static void MappingWithExistsRow<TS, TD>(TS source, TD destination)
        {
            if (source == null || destination == null) return;
            var properties = source.GetType().GetProperties().Where(s => s.PropertyType == typeof(int) || s.PropertyType == typeof(string));
            foreach (var property in properties)
            {
                if (property.Name.ToUpper() != "ID" && !property.Name.ToUpper().EndsWith("ID"))
                {
                    if (property.GetCustomAttributes(typeof(IgnoreMapWhenImport), false).Length != 0)
                    {
                        continue;
                    }
                    destination.GetType().GetProperty(property.Name).SetValue(destination, property.GetValue(source, null), null);
                }
            }
        }
        /// <summary>
        /// Validate an object
        /// </summary>
        /// <param name="coconAddress"></param>
        /// <returns>JSON string if error OR NULL if object valid</returns>
        private static string ValidateObject(CoconAddress coconAddress)
        {
            var errors = new List<string>();
            if (string.IsNullOrEmpty(coconAddress.Zipcode))
            {
                errors.Add(Utils.Message.Required.GetDescription("ZIPCODE"));
            }
            else if (!ValidateZipcode(coconAddress.Zipcode))
            {
                errors.Add(Utils.Message.DoesNotMatch.GetDescription("ZIPCODE"));
            }
            if (coconAddress.HouseNumber == -1)
            {
                errors.Add(Utils.Message.DoesNotMatch.GetDescription("HOUSENUMBER"));
            }
            return errors.Any() ? Newtonsoft.Json.JsonConvert.SerializeObject(errors) : null;
        }

        private static bool ValidateZipcode(string zipcode)
        {
            var regex = new Regex(@"[0-9]{4}[A-Z]{2}$");
            return regex.IsMatch(zipcode);
        }
        /// <summary>
        /// Connect Sftp And DownFiles
        /// </summary>
        /// <returns></returns>
        public static Hashtable ConnectSftpAndDownFiles(SftpInfo sftpInfo, string remotePath, string saveFilePath, List<string> filesImported = null)
        {
            var listStream = new Hashtable();
            SftpClient sftpClient = null;
            try
            {
                var fileType = Configuration["fileType"]?.Split(';');
                Logger.Info("Connect to  SFTP - Begin");
                sftpClient = SftpUtils.Connect(sftpInfo);
                if (sftpClient == null)
                {
                    Logger.Warn("Cannot connect to  SFTP");
                    return null;
                }
                //download files from SFTP server
                listStream = SftpUtils.DownloadFiles(sftpClient, saveFilePath, remotePath, fileType, filesImported);
                Logger.Info("Connect to  SFTP - End");
                return listStream;
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
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

        private CoconAddress BindingData(string[] data)
        {
            if (data.Length != ColumnsMapping.Count) return null;

            var coconAddressFibersParties1 = new CoconAddressFibersParties();
            var coconAddressFibersParties2 = new CoconAddressFibersParties();
            var coconAddressFibersParties3 = new CoconAddressFibersParties();
            var coconAddressFibersParties4 = new CoconAddressFibersParties();
            CoconAddressFiber fiber1 = null;
            if (!(string.IsNullOrEmpty(data[ColumnsMapping["LocationName1"]]) && string.IsNullOrEmpty(data[ColumnsMapping["Row1"]]) && string.IsNullOrEmpty(data[ColumnsMapping["Closet1"]]) &&
                  string.IsNullOrEmpty(data[ColumnsMapping["PopShelf1"]]) && string.IsNullOrEmpty(data[ColumnsMapping["Position1"]]) && string.IsNullOrEmpty(data[ColumnsMapping["Port1"]])))
            {
                fiber1 = new CoconAddressFiber
                {
                    LocationName = data[ColumnsMapping["LocationName1"]],
                    Row = data[ColumnsMapping["Row1"]],
                    Closet = data[ColumnsMapping["Closet1"]],
                    PopShelf = data[ColumnsMapping["PopShelf1"]],
                    Position = data[ColumnsMapping["Position1"]],
                    Port = data[ColumnsMapping["Port1"]],
                    ActiveOperator = data[ColumnsMapping["ActiveOperator1"]],
                    ActiveOperatorPlanned = data[ColumnsMapping["ActiveOperatorPlanned1"]],
                    OrderType = data[ColumnsMapping["OrderType1"]],
                    ActiveOrderTypePlanned = data[ColumnsMapping["ActiveOrderTypePlanned1"]],
                    ActiveOperatorOrderId = data[ColumnsMapping["OrderId1"]],
                    ActiveOperatorOrderIdPlanned = data[ColumnsMapping["ActiveOperatorOrderIdPlanned1"]],
                    FiberType = (int)CoconEnum.FiberEnum.FIBER_A
                };
            }
            coconAddressFibersParties1.CoconAddressFiber = fiber1;
            coconAddressFibersParties2.CoconAddressFiber = fiber1;
            CoconAddressFiber fiber2 = null;
            if (!(string.IsNullOrEmpty(data[ColumnsMapping["LocationName2"]]) && string.IsNullOrEmpty(data[ColumnsMapping["Row2"]]) && string.IsNullOrEmpty(data[ColumnsMapping["Closet2"]]) &&
                  string.IsNullOrEmpty(data[ColumnsMapping["PopShelf2"]]) && string.IsNullOrEmpty(data[ColumnsMapping["Position2"]]) && string.IsNullOrEmpty(data[ColumnsMapping["Port2"]])))
            {
                fiber2 = new CoconAddressFiber
                {
                    LocationName = data[ColumnsMapping["LocationName2"]],
                    Row = data[ColumnsMapping["Row2"]],
                    Closet = data[ColumnsMapping["Closet2"]],
                    PopShelf = data[ColumnsMapping["PopShelf2"]],
                    Position = data[ColumnsMapping["Position2"]],
                    Port = data[ColumnsMapping["Port2"]],
                    ActiveOperator = data[ColumnsMapping["ActiveOperator2"]],
                    ActiveOperatorPlanned = data[ColumnsMapping["ActiveOperatorPlanned2"]],
                    OrderType = data[ColumnsMapping["OrderType2"]],
                    ActiveOrderTypePlanned = data[ColumnsMapping["ActiveOrderTypePlanned2"]],
                    ActiveOperatorOrderId = data[ColumnsMapping["OrderId2"]],
                    ActiveOperatorOrderIdPlanned = data[ColumnsMapping["ActiveOperatorOrderIdPlanned2"]],
                    FiberType = (int)CoconEnum.FiberEnum.FIBER_B
                };
            }

            coconAddressFibersParties3.CoconAddressFiber = fiber2;
            coconAddressFibersParties4.CoconAddressFiber = fiber2;

            if (!DateTime.TryParse(data[ColumnsMapping["HasBegin"]], out var hasbegin))
            {
                if (!string.IsNullOrEmpty(data[ColumnsMapping["HasBegin"]]))
                {
                    hasbegin = DateTime.ParseExact(data[ColumnsMapping["HasBegin"]], "d-M-yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                }
            }


            if (!(string.IsNullOrEmpty(data[ColumnsMapping["HUDEER1"]]) && string.IsNullOrEmpty(data[ColumnsMapping["HUDEERAREA1"]])))
            {
                coconAddressFibersParties1.CoconAddressParty = new CoconAddressParty
                {
                    Name = !string.IsNullOrEmpty(data[ColumnsMapping["HUDEER1"]]) ? data[ColumnsMapping["HUDEER1"]] : null,
                    Area = !string.IsNullOrEmpty(data[ColumnsMapping["HUDEERAREA1"]]) ? data[ColumnsMapping["HUDEERAREA1"]] : null,
                    PartyTypeId = (int)CoconEnum.PartyType.Huurder
                };
            }
            if (!(string.IsNullOrEmpty(data[ColumnsMapping["BEHEDDER1"]]) && string.IsNullOrEmpty(data[ColumnsMapping["BEHEDDERAREA1"]])))
            {
                coconAddressFibersParties2.CoconAddressParty = new CoconAddressParty
                {
                    Name = !string.IsNullOrEmpty(data[ColumnsMapping["BEHEDDER1"]]) ? data[ColumnsMapping["BEHEDDER1"]] : null,
                    Area = !string.IsNullOrEmpty(data[ColumnsMapping["BEHEDDERAREA1"]]) ? data[ColumnsMapping["BEHEDDERAREA1"]] : null,
                    PartyTypeId = (int)CoconEnum.PartyType.Beheerder
                };
            }

            if (!(string.IsNullOrEmpty(data[ColumnsMapping["HUDEER2"]]) && string.IsNullOrEmpty(data[ColumnsMapping["HUDEERAREA2"]])))
            {
                coconAddressFibersParties3.CoconAddressParty = new CoconAddressParty
                {
                    Name = !string.IsNullOrEmpty(data[ColumnsMapping["HUDEER2"]]) ? data[ColumnsMapping["HUDEER2"]] : null,
                    Area = !string.IsNullOrEmpty(data[ColumnsMapping["HUDEERAREA2"]]) ? data[ColumnsMapping["HUDEERAREA2"]] : null,
                    PartyTypeId = (int)CoconEnum.PartyType.Huurder
                };
            }

            if (!(string.IsNullOrEmpty(data[ColumnsMapping["BEHEDDER2"]]) && string.IsNullOrEmpty(data[ColumnsMapping["BEHEDDERAREA2"]])))
            {
                coconAddressFibersParties4.CoconAddressParty = new CoconAddressParty
                {
                    Name = !string.IsNullOrEmpty(data[ColumnsMapping["BEHEDDER2"]]) ? data[ColumnsMapping["BEHEDDER2"]] : null,
                    Area = !string.IsNullOrEmpty(data[ColumnsMapping["BEHEDDERAREA2"]]) ? data[ColumnsMapping["BEHEDDERAREA2"]] : null,
                    PartyTypeId = (int)CoconEnum.PartyType.Beheerder
                };
            }

            var address = new CoconAddress
            {
                Zipcode = data[ColumnsMapping["Zipcode"]],
                //HouseNumber equal -1 used to validation
                HouseNumber = int.TryParse(data[ColumnsMapping["HouseNumber"]], out var _) ? Convert.ToInt32(data[ColumnsMapping["HouseNumber"]]) : -1,
                HousenumberExt = data[ColumnsMapping["HouseNumberExt"]],
                Room = data[ColumnsMapping["Room"]],
                AreaNumber = data[ColumnsMapping["AreaNumber"]],
                ContractArea = data[ColumnsMapping["ContractArea"]],
                DeliveryClass = data[ColumnsMapping["DeliveryClass"]],
                ConnectionStatus = data[ColumnsMapping["ConnectionStatus"]],
                CommentsOnDeliveryClass = data[ColumnsMapping["CommentsOnDeliveryClass"]],
                HasBegin = hasbegin != DateTime.MinValue ? hasbegin : (DateTime?)null,
                FtuType = data[ColumnsMapping["FtuType"]],
                AreaCode = data[ColumnsMapping["AreaCode"]],
                SingleChangeCode = data[ColumnsMapping["SingleChangeCode"]],
                RedemtionCode = data[ColumnsMapping["RedemtionCode"]],
                Purchased = bool.TryParse(data[ColumnsMapping["Purchased"]], out _)
            };
            if (coconAddressFibersParties1.CoconAddressFiber != null ||
                coconAddressFibersParties1.CoconAddressParty != null)
            {
                address.CoconAddressFibersPartieses.Add(coconAddressFibersParties1);
            }

            if (coconAddressFibersParties2.CoconAddressFiber != null ||
                coconAddressFibersParties2.CoconAddressParty != null)
            {
                address.CoconAddressFibersPartieses.Add(coconAddressFibersParties2);
            }
            if (coconAddressFibersParties3.CoconAddressFiber != null ||
                coconAddressFibersParties3.CoconAddressParty != null)
            {
                address.CoconAddressFibersPartieses.Add(coconAddressFibersParties3);
            }
            if (coconAddressFibersParties4.CoconAddressFiber != null ||
                coconAddressFibersParties4.CoconAddressParty != null)
            {
                address.CoconAddressFibersPartieses.Add(coconAddressFibersParties4);
            }
            return address;
        }
    }
}
