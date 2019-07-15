using System;

namespace Services
{
    public interface ISftp
    {
        void CreateSftpFolders(string desPath);
        bool UploadFileToSftp(String strSource, String strDesPath, string fileName, bool blOverride);
        bool connectSftpServer(String strHost, int iPort, String strUserName, String strPassword, int iTimeout);
    }
}
