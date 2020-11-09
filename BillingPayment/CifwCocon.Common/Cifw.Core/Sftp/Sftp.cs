

namespace Cifw.Core.Sftp
{
    using Renci.SshNet;
    using Renci.SshNet.Sftp;
    using System;
    using System.Collections;
    using System.IO;
    using System.Linq;
    using Cifw.Core.Logging;
    using Microsoft.Extensions.Configuration;
    public interface ISftp
    {
        void Init(string host, int port, string username, string password, PrivateKeyFile[] keyFiles = null);
        void Init();
        Hashtable DowloadFiles();
        void MoveFileDownloadedToBackupFolder();
        void Dispose();
    }
    public class Sftp : ISftp
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private SftpClient _sftpClient;
        private SftpFile[] _sftpFiles;
        private string _remotePath = string.Empty;
        private string _localPath = string.Empty;
        private string _delimiter = string.Empty;
        private string[] _fileTypes;
        public Sftp(ILogger logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public void Init(string host, int port, string username, string password, PrivateKeyFile[] keyFiles = null)
        {
            var connectionInfo = keyFiles != null ? new ConnectionInfo(host, port, username, new PasswordAuthenticationMethod(username, password), new PrivateKeyAuthenticationMethod(username, keyFiles)) : new ConnectionInfo(host, port, username, new PasswordAuthenticationMethod(username, password));
            _sftpClient = new SftpClient(connectionInfo)
            {
                //TODO: Add this configuration to appsettings.json
                ConnectionInfo = { Timeout = TimeSpan.FromMinutes(3) },
                OperationTimeout = TimeSpan.FromMinutes(20)
            };





            _remotePath = _configuration["SftpConfig:remotePath"];
            _localPath = _configuration["SftpConfig:localPath"];
            _delimiter = _configuration["SftpConfig:delimiter"];
            if (!string.IsNullOrEmpty(_delimiter))
            {
                _fileTypes = string.IsNullOrEmpty(_configuration["SftpConfig:fileTypes"]) ? _configuration["SftpConfig:fileTypes"].Split(_delimiter) : null;
            }
        }

        public void Init()
        {
            var missingConfig = false;
            var host = _configuration["SftpConfig:host"];
            int.TryParse(_configuration["SftpConfig:port"], out var port);
            var username = _configuration["SftpConfig:username"];
            var password = _configuration["SftpConfig:password"];

            if (string.IsNullOrEmpty(host))
            {
                missingConfig = true;
                _logger.Error("Host(server) config is missing");
            }
            if (port == 0)
            {
                missingConfig = true;
                _logger.Error("Port config is missing");
            }
            if (string.IsNullOrEmpty(username))
            {
                missingConfig = true;
                _logger.Error("Username config is missing");
            }
            if (string.IsNullOrEmpty(password))
            {
                missingConfig = true;
                _logger.Error("Password config is missing");
            }
          
            _remotePath = _configuration["SftpConfig:remotePath"];
            _localPath = _configuration["SftpConfig:localPath"];
            _delimiter = _configuration["SftpConfig:delimiter"];
            if (!string.IsNullOrEmpty(_delimiter))
            {
                _fileTypes = !string.IsNullOrEmpty(_configuration["SftpConfig:fileTypes"]) ? _configuration["SftpConfig:fileTypes"].Split(_delimiter) : null;
            }
            if (string.IsNullOrEmpty(_remotePath))
            {
                missingConfig = true;
                _logger.Error("Remote Path config is missing");
            }
            if (string.IsNullOrEmpty(_localPath))
            {
                missingConfig = true;
                _logger.Error("Local Path config is missing");
            }
            if (string.IsNullOrEmpty(_delimiter))
            {
                missingConfig = true;
                _logger.Error("Delimiter Path config is missing");
            }
            if (_fileTypes == null)
            {
                missingConfig = true;
                _logger.Error("File Types Extension config is missing");
            }

            if (!missingConfig)
            {
                var connectionInfo = new ConnectionInfo(host, port, username, new PasswordAuthenticationMethod(username, password));
                _sftpClient = new SftpClient(connectionInfo)
                {
                    //TODO: Add this configuration to appsettings.json
                    ConnectionInfo = { Timeout = TimeSpan.FromMinutes(3) },
                    OperationTimeout = TimeSpan.FromMinutes(20)
                };
                _logger.Info("SFTP was initialed");
            }
        }

        public Hashtable DowloadFiles()
        {
            if(!_sftpClient.IsConnected) _sftpClient.Connect();
            _logger.Info("SFTP was connected");
            Hashtable result = null;
            //Create folder where store files downloaded from SMTP server.
            if (!Directory.Exists(_localPath))
            {
                Directory.CreateDirectory(_localPath);
            }
            //List all file in SFTP server
            var listFilesAndFolders = _sftpClient?.ListDirectory(_remotePath)?.ToArray();
            if (listFilesAndFolders != null && listFilesAndFolders.Any())
            {
                listFilesAndFolders = listFilesAndFolders.Where(s => s.IsDirectory == false && !string.IsNullOrEmpty(s.Name)).OrderBy(s => s.Name).ToArray();
                if (listFilesAndFolders.Any())
                {
                    _sftpFiles = listFilesAndFolders;
                    result = new Hashtable();
                    foreach (var fileOrFolder in listFilesAndFolders)
                    {
                        if (_fileTypes.Contains(Path.GetExtension(fileOrFolder.Name).ToUpper()))
                        {
                            var file = File.OpenWrite($"{_localPath}\\{fileOrFolder.Name}");
                            _sftpClient.DownloadFile(fileOrFolder.FullName, file);
                            file.Close();
                            result.Add($"{_localPath}\\{fileOrFolder.Name}", DateTime.Now);
                            _logger.Info($"[{fileOrFolder.Name}] was downloaded.");
                        }
                    }
                }
                else
                {
                    _logger.Info("SFTP server folder is empty.");
                }
            }
            if (_sftpClient.IsConnected)
            {
                _sftpClient.Disconnect();
            }
            _logger.Info("SFTP was disconnected");
            return result;
        }

        public void Dispose()
        {
            if (_sftpClient == null) return;
            if (_sftpClient.IsConnected)
            {
                _sftpClient.Disconnect();
            }
            _sftpClient.Dispose();
        }
        public void MoveFileDownloadedToBackupFolder()
        {
            if (!_sftpClient.IsConnected) _sftpClient.Connect();
            _sftpClient.ChangeDirectory("/");
            foreach (var sftpFile in _sftpFiles)
            {
                var pathToCreateBackup = Path.GetDirectoryName(sftpFile.FullName);
                if (!string.IsNullOrEmpty(pathToCreateBackup))
                {
                    var backupPath = Path.Combine(pathToCreateBackup, "backup");
                    //Check backup folder is exists
                    if (!_sftpClient.Exists(backupPath))
                    {
                        //Create backup folder
                        _sftpClient.CreateDirectory(backupPath);
                        _sftpClient.ChangePermissions(backupPath, 777);
                    }
                    //Move current file to backup after download is done.
                    _sftpClient.RenameFile(Path.Combine(sftpFile.FullName, ""), $"{backupPath}\\{DateTime.Now:yyyyMMddHHmmss}{sftpFile.Name}");
                }
            }
            if (_sftpClient.IsConnected)
            {
                _sftpClient.Disconnect();
            }
        }

    }
}
