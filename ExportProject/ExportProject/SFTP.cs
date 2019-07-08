using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Mail;
using System.Text;
using Renci.SshNet;

namespace ExportProject
{
    class SFTP
    {
        private string m_strErrorDes;
        private SftpClient m_sftpClient = null;
        public bool UploadFileToSftp(String strSource, String strDesPath, bool blOverride)
        {
            bool blResult = false;
            FileStream fileStream = null;

            try
            {
                this.m_strErrorDes = "";

                //in here we will get stream of file from local dir
                fileStream = new FileStream(strSource, FileMode.Open, FileAccess.Read);
                this.m_sftpClient.UploadFile(fileStream, strDesPath, blOverride, null);
                blResult = true;
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
        public bool connectSftpServer(String strHost, int iPort, String strUserName,
            String strPassword, int iTimeout)
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
    }
}
