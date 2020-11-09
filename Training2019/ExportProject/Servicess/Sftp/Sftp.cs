using Renci.SshNet;
using Services;
using System;
using System.IO;
namespace ExportProject
{
    public class Sftp : ISftp
    {

        private string m_strErrorDes;
        private SftpClient m_sftpClient = null;
        ReadFileJson json = new ReadFileJson();
        private void CreateSftpFolders(string desPath)
        {
            string[] folderLevel = desPath.Split('\\');
            string currentPath = "\\";
            foreach (string item in folderLevel)
            {
                if (item != "")
                {
                    m_sftpClient.CreateDirectory(currentPath + item + '\\');
                    currentPath += item + "\\";
                }
            }
        }
        public bool UploadFileToSftp(String strSource, String strDesPath, string fileName, bool blOverride)
        {
            bool blResult = false;
            FileStream fileStream = null;
            fileStream = new FileStream(strSource, FileMode.Open, FileAccess.Read);
            try
            {
                string strFileName = Path.GetFileName(strSource);
                string strFileWithoutExt = Path.GetFileNameWithoutExtension(strFileName);
                string strExtension = Path.GetExtension(strFileName);
                this.m_strErrorDes = "";
                if (strExtension == ".csv" && m_sftpClient.Exists(strDesPath))
                {
                    this.m_sftpClient.UploadFile(fileStream, strDesPath + fileName, blOverride, null);

                }
                //in here we will get stream of file from local dir
                else
                {
                    if (strExtension == ".csv")
                    {
                        CreateSftpFolders(strDesPath);
                        this.m_sftpClient.UploadFile(fileStream, strDesPath + fileName, blOverride, null);
                    }
                    else
                    {
                        throw new FormatException();
                    }

                }
            }
            catch (Exception exp)
            {
                this.m_strErrorDes = "SFTP_0001: ERROR - " + exp.Message;
            }
            finally
            {
                //after open file stream please close file stream let handle of file to be free
                if (fileStream != null)
                {
                    fileStream.Close();
                }
            }
            return blResult;
        }
        public bool connectSftpServer(String strHost, int iPort, String strUserName, String strPassword, int iTimeout)
        {
            bool blResult = false;
            try
            {
                this.m_strErrorDes = "";
                //create a new instance for sftp client variable
                this.m_sftpClient = new SftpClient(strHost, iPort, strUserName, strPassword);
                this.m_sftpClient.ConnectionInfo.Timeout = TimeSpan.FromSeconds(iTimeout);
                this.m_sftpClient.KeepAliveInterval = TimeSpan.FromSeconds(10);
                //connect to server
                this.m_sftpClient.Connect();
                blResult = true;
            }
            catch (Exception exp)
            {
                //return error let show for user
                this.m_strErrorDes = "SFTP_0000: ERROR - " + exp.Message;
            }
            return blResult;
        }

        void ISftp.CreateSftpFolders(string desPath)
        {
            throw new NotImplementedException();
        }
    }
}
