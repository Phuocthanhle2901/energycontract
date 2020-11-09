namespace CifwCocon.ImportBiz
{
    using Base;
    using System;
    using System.IO;
    using System.Linq;
    using IFD.Logging;
    using ImportRepo;
    using ImportRepo.Entities;
    using Microsoft.EntityFrameworkCore.Internal;
    using Microsoft.Extensions.Configuration;
    using Common;
    using Bo;
    using System.Text.RegularExpressions;
    using System.Collections.Generic;
    using System.Collections;
    using System.Globalization;
    using CifwCocon.ImportBiz.Extensions;

    public interface IBillingBiz : IBizBase<CoconBillingAddress>
    {
        void Sync();
    }
    public class BillingBiz : BizBase<CoconBillingAddress>, IBillingBiz
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger _logger;
        private readonly Common.Sftp.ISftp _sftp;
        private readonly string _delimiter;
        private readonly string _connection;
        private readonly int _batch;        

        public BillingBiz(ILogger logger, Common.Sftp.ISftp sftp, IConfiguration configuration)
        {
            _logger = logger;
            _sftp = sftp;
            _configuration = configuration;
            _delimiter = _configuration["delimiter"];
            _connection = _configuration["ConnectionString"];
            int.TryParse(_configuration["batch"], out _batch);
        }

        public virtual void Sync()
        {
            try
            {
                _sftp.Init();
                var hashtable = _sftp.DowloadFiles();
                if (hashtable != null && hashtable.Any())
                {
                    var files = OrderFileToImport(hashtable);
                    //var files = hashtable.Keys.Cast<string>().OrderByDescending(s => s).ToList();                    
                    foreach (var file in files)
                    {
                        var fileInfo = new FileInfo(file);
                        if (fileInfo != null)
                        {
                            Process(fileInfo);
                        }
                        //Local
                        Utils.MoveFileToBackup(fileInfo);
                    }
                    //Sftp
                    _sftp.MoveFileDownloadedToBackupFolder();
                }
            }
            catch (Exception e)
            {
                _logger.Info($"Sync process was teminated. Cause by: {e.InnerException?.Message ?? e.Message}");
            }
            finally
            {
                _sftp.Dispose();
            }
        }


        /// <summary>
        /// Order file position to import
        /// CAIWAFKOOP-1-20092018-15.19
        /// CAIWAFKOOP-1-21092018-20.03
        /// </summary>
        /// <param name="files"></param>
        /// <returns></returns>
        private List<string> OrderFileToImport(Hashtable files)
        {
            try
            {
                int PartFileAfterSplit = string.IsNullOrWhiteSpace(_configuration["PartFileAfterSplit"]) ? 5 : int.Parse(_configuration["PartFileAfterSplit"]);
                var fileNames = files.Keys.Cast<string>()
                        .OrderBy(s => FileNameExtension.GetOrderPart(s, PartFileAfterSplit))
                        .OrderBy(s => FileNameExtension.GetDateTimePart(s, PartFileAfterSplit)).ToList();
                return fileNames;
            }
            catch (Exception ex)
            {
                _logger.Info($"Wrong format to order file import to databse. Cause by: {ex.InnerException?.Message ?? ex.Message}");
                throw ex;
            }
            
        }

        private void Process(FileInfo fileInfo)
        {
            using (var context = new CifwCocon2018DbContext(_connection))
            {
                try
                {
                    // datetime start import
                    // fime name {fileInfo.Name}
//                    Records in file: [1234567890]

//          Records created in local database: [1234567890]

//          Records updated in local database: [1234567890]

//          Addresses updated in Cocon: [1234567890]

//          Errors writing data to Cocon: [1234567890]

                    _logger.Info($"Start import {fileInfo.Name.Trim('/')}");
                    var index = 1;
                    using (var reader = new StreamReader(fileInfo.FullName))
                    {
                        reader.ReadLine();
                        while (!reader.EndOfStream)
                        {
                            var line = reader.ReadLine();
                            if (string.IsNullOrEmpty(line)) continue;
                            var data = SplitCsv(line);
                            if (IsValidAddress(data, out var coconAddress))
                            {
                                var address = context.CoconBillingAddresses.FirstOrDefault(s => s.Zipcode == coconAddress.Zipcode
                                && s.HouseNumber == coconAddress.HouseNumber
                                && (string.IsNullOrWhiteSpace(coconAddress.HousenumberExt) ? s.HousenumberExt == null || s.HousenumberExt == string.Empty : s.HousenumberExt == coconAddress.HousenumberExt)
                                && (string.IsNullOrWhiteSpace(coconAddress.Room) ? s.Room == null || s.Room == string.Empty : s.Room == coconAddress.Room));
                                

                                if(address == null)
                                {
                                    //get address before saveChanges
                                    address = context.CoconBillingAddresses.Local.FirstOrDefault(s => s.Zipcode == coconAddress.Zipcode
                                        && s.HouseNumber == coconAddress.HouseNumber
                                        && (string.IsNullOrWhiteSpace(coconAddress.HousenumberExt) ? s.HousenumberExt == null || s.HousenumberExt == string.Empty : s.HousenumberExt == coconAddress.HousenumberExt)
                                        && (string.IsNullOrWhiteSpace(coconAddress.Room) ? s.Room == null || s.Room == string.Empty : s.Room == coconAddress.Room));
                                }

                                if (address != null)
                                {
                                    // Addresses updated in Cocon: [1234567890]

                                    MappEntityFromObject(coconAddress, address);
                                }                                
                                else
                                {
                                    //Create new Address what provided by EOL
                                    var addressMapped = MappEntityFromObject(coconAddress);
                                    context.CoconBillingAddresses.Add(addressMapped);
                                }

                            }
                            //Commit each _batch rows
                            if (index % _batch == 0)
                            {
                                context.SaveChanges();
                            }
                            index++;
                        }
                    }
                    context.SaveChanges();

                    // datetime finish import
                    _logger.Info($"Finish import {fileInfo.Name.Trim('/')}");
                }
                catch (Exception ex)
                {
                    _logger.Error($"Import {fileInfo.Name} terminated. Transaction was rollbacked.", ex);
                }
            }
        }
        public bool IsValidAddress(string[] args, out CoconAddressBo coconAddress)
        {
            var result = true;
            coconAddress = null;
            if (args.Length != 6)
            {
                _logger.Error(Utils.Message.DoesNotMatch.GetDescription("ROW"));
                _logger.Error(args.Join(_delimiter));
                return false;
            }
            var dataColumns = new List<string>();
            foreach (var data in args)
            {
                var value = data.Trim('\"');
                dataColumns.Add(value);
            }
            byte.TryParse(dataColumns[5], out var statusOfPayment);
            var article = dataColumns[4];
            var zipCode = dataColumns[3];
            var addressConnection = dataColumns[2];
            int.TryParse(dataColumns[0], out var relationId);
            var relationName = dataColumns[1];

            coconAddress = new CoconAddressBo
            {
                RelationId = relationId,
                NameOfRelation = relationName.Trim('\''),
                AddressConnection = addressConnection.Trim('\''),
                Zipcode = zipCode,
                Article = article,
                StatusOfPayment = statusOfPayment == 0 ? (byte?)null : statusOfPayment
            };
            if (string.IsNullOrEmpty(coconAddress.Zipcode))
            {
                _logger.Error(Utils.Message.Required.GetDescription("ZIPCODE"));
                result = false;
            }
            else if (!Utils.ValidateZipcode(coconAddress.Zipcode))
            {
                _logger.Error(Utils.Message.DoesNotMatch.GetDescription($"ZIPCODE({zipCode})"));
                result = false;
            }
            if (!coconAddress.IsAddressValid)
            {
                _logger.Error(Utils.Message.WrongFormat.GetDescription($"ADDRESSCONNECTIONS({coconAddress.AddressConnection})"));
                result = false;
            }
            else if (coconAddress.HouseNumber == 0)
            {
                _logger.Error(Utils.Message.Required.GetDescription("HOUSENUMBER"));
                result = false;
            }
            if (!result)
            {
                _logger.Error(dataColumns.Join(_delimiter));
            }
            return result;
        }
        private string[] SplitCsv(string input)
        {
            input = input.Replace(",'", ",\"").Replace("',", "\",").Replace(", '", ",\"").Replace("' ,", "\",");
            var csvParser = new Regex(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
            var fields = csvParser.Split(input);
            return fields;
        }
    }
}
