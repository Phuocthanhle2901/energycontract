using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using CifwCocon.ImportBiz.Common.Sftp.Model;
using CifwCocon.ImportBiz.Logging;
using CifwCocon.ImportRepo;
using Renci.SshNet;
using Renci.SshNet.Sftp;

namespace CifwCocon.ImportBiz.Common.Sftp
{
    public class SftpUtils
    {
        private static readonly ApplicationSetting AppSetting = new ApplicationSetting();
        private static readonly ILogger Logger = LoggingFactory.GetsLogger();
        /// <summary>
        /// Connect sftp server
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        /// <exception>
        ///     <cref>IspPortalException</cref>
        /// </exception>
        public static SftpClient Connect(SftpInfo info)
        {
            ConnectionInfo connectionInfo;
            if (info.KeyFiles != null)
            {
                connectionInfo = new ConnectionInfo(info.Host, info.Port, info.UserName,
                                                        new PasswordAuthenticationMethod(info.UserName, info.Password),
                                                        new PrivateKeyAuthenticationMethod(info.UserName, info.KeyFiles)
                    );
            }
            else
            {
                connectionInfo = new ConnectionInfo(info.Host, info.Port, info.UserName,
                                                    new PasswordAuthenticationMethod(info.UserName, info.Password)
                );
            }
            var sftp = new SftpClient(connectionInfo)
            {
                ConnectionInfo = {Timeout = TimeSpan.FromMinutes(3)},
                OperationTimeout = TimeSpan.FromMinutes(20)
            };
            sftp.Connect();

            return sftp;
        }

        public static SftpClient ConnectExt(SftpInfo info, out bool success)
        {
            success = false;
            ConnectionInfo connectionInfo;
            if (info.KeyFiles != null)
            {
                connectionInfo = new ConnectionInfo(info.Host, info.Port, info.UserName,
                                                        new PasswordAuthenticationMethod(info.UserName, info.Password),
                                                        new PrivateKeyAuthenticationMethod(info.UserName, info.KeyFiles)
                    );
            }
            else
            {
                connectionInfo = new ConnectionInfo(info.Host, info.Port, info.UserName,
                                                    new PasswordAuthenticationMethod(info.UserName, info.Password)
                );
            }
            var sftp = new SftpClient(connectionInfo);
            sftp.ConnectionInfo.Timeout = TimeSpan.FromMinutes(3);
            sftp.OperationTimeout = TimeSpan.FromMinutes(20);
            try
            {
                sftp.Connect();
                success = true;
            }
            catch (System.Exception ex)
            {
                //throw new SftpException(ex.Message, ex);
            }
            return sftp;
        }


        /// <summary>
        /// Download files from remote folder
        /// </summary>
        /// <param name="sftpClient"></param>
        /// <param name="saveFileFolder"></param>
        /// <param name="remotePath"></param>
        /// <param name="fileType"></param>
        /// <param name="filesImported"></param>
        /// <returns></returns>
        public static Hashtable DownloadFiles(SftpClient sftpClient, string saveFileFolder,string remotePath, string[] fileType, List<string> filesImported = null)
        {
            var listStream = new Hashtable();
            //list remote files
            var lstFile = sftpClient.ListDirectory(remotePath);
            // Create directory local folder
            CreateDirectory(saveFileFolder);
            var directoryListItems = lstFile as SftpFile[] ?? lstFile.ToArray();
            if (filesImported != null)
            {
                directoryListItems = directoryListItems.Where(s => s.IsDirectory == false && !string.IsNullOrEmpty(s.Name)).OrderBy(s => s.Name).Where(s => !filesImported.Contains(s.Name)).Take(1).ToArray();
            }
            else
            {
                directoryListItems = directoryListItems.Where(s => s.IsDirectory == false && !string.IsNullOrEmpty(s.Name)).OrderBy(s => s.Name).Take(1).ToArray();
            }
            foreach (var directoryListItem in directoryListItems)
            {
                //check matched extension type
                var isContinue = false;
                foreach (var ext in fileType)
                {
                    if (directoryListItem.Name.ToUpper().Contains(ext))
                    {
                        isContinue = false;
                        break;
                    }
                    isContinue = true;
                }
                if (isContinue)
                {
                    //do not download this file
                    continue;
                }
                var fileName = directoryListItem.Name;
                if (string.IsNullOrEmpty(fileName)) // file name was not found.
                {
                    continue;
                }
                //Ignore files is imported
                //if (filesImported != null && filesImported.Contains(directoryListItem.Name))
                //{
                //    continue;
                //}               
                var fullUploadFileName = string.Format(@"{0}\{1}", saveFileFolder, fileName);
                var ratedFile = File.OpenWrite(fullUploadFileName);
                //download file
                sftpClient.DownloadFile(directoryListItem.FullName, ratedFile);
                ratedFile.Close();
                listStream.Add(fullUploadFileName, DateTime.Now);
                Thread.Sleep(500); // sleep 
                Logger.Info($"{fileName} was downloaded");
            }
            return listStream;
        }
        /// <summary>
        /// CreateDirectory
        /// </summary>
        /// <param name="folderPath"></param>
        private static void CreateDirectory(string folderPath)
        {
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
        }

        /// <summary>
        /// InitSftpInfo
        /// </summary>
        /// <returns></returns>
        public static SftpInfo InitSftpInfo(string host, int port, string userName, string password)
        {
            var sftpInfo = new SftpInfo
            {
                Host = host,
                Port = port,
                UserName = userName,
                Password = password
            };
            return sftpInfo;
        }


        #region Application Setting

        public static string GetFileType()
        {
            return AppSetting.FileType;
        }
        #endregion
    }
}

