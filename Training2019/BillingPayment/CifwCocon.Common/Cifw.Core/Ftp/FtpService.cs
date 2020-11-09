using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using Cifw.Core.Logging;
using FluentFTP;
using Microsoft.Extensions.Configuration;

namespace Cifw.Core.Ftp
{
    public class FtpService : IFtpService
    {
        protected FtpClient FtpClient;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        public FtpService(ILogger logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            FtpClient = new FtpClient();
        }

        public void Initial()
        {
            var host = _configuration["ftp:host"];
            var username = _configuration["ftp:username"];
            var password = _configuration["ftp:password"];
            var port = 21;
            int.TryParse(_configuration["ftp:port"], out port);

            FtpClient.Host = host;
            FtpClient.Port = port;
            FtpClient.Credentials = new NetworkCredential(username, password);
            FtpClient.Connect();
            _logger.Info("FTP server connected");
        }

        public List<string> DownloadFile(List<string> filesImported)
        {
            List<string> filesDownLoaded = null;
            try
            {
                if (FtpClient.IsConnected)
                {
                    var fileType = _configuration["ftp:fileTypes"]?.Split(';');
                    var localPath = _configuration["ftp:localPath"];
                    var remotePath = _configuration["ftp:remotePath"];
                    //if (fileType == null) return null;
                    var filesOnFtpServer = FtpClient.GetNameListing(remotePath);
                    if (fileType != null)
                    {
                        filesOnFtpServer = filesOnFtpServer.Where(s => fileType.Any(s.EndsWith)).ToArray();
                    }
                    if (filesImported != null && filesImported.Any())
                    {
                        filesOnFtpServer = filesOnFtpServer.Where(s => !filesImported.Contains(Path.GetFileName(s))).ToArray();
                    }
                    if (!filesOnFtpServer.Any()) return null;
                    //Create folder to recieve csv file.
                    if (!Directory.Exists(localPath))
                    {
                        Directory.CreateDirectory(localPath);
                    }
                    foreach (var file in filesOnFtpServer)
                    {
                        filesDownLoaded = new List<string>();
                        var fileSaveOnLocal = Path.GetFileName(file);
                        var downloadTo = $"{localPath}\\{fileSaveOnLocal.Trim('/')}";
                        var downloaded = FtpClient.DownloadFile(downloadTo, file);
                        if (downloaded)
                        {
                            filesDownLoaded.Add(downloadTo);
                            _logger.Info($"{fileSaveOnLocal} was downloaded");
                        }
                    }
                }
            }
            catch (Exception e)
            {
                _logger.Error("Download file failed", e);
            }
            return filesDownLoaded;
        }
        public void Dispose()
        {
            if (FtpClient == null) return;
            if (FtpClient.IsConnected)
            {
                FtpClient.Disconnect();
                FtpClient.Dispose();
            }
        }
    }
}
