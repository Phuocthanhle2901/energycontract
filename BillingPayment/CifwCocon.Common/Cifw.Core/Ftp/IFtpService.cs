using System.Collections.Generic;

namespace Cifw.Core.Ftp
{
    public interface IFtpService
    {
        void Initial();
        void Dispose();
        /// <summary>
        /// Download file from ftp server
        /// </summary>
        /// <param name="filesImported">list files were imported which ignored and DO NOT downloaded </param>
        /// <returns></returns>
        List<string> DownloadFile(List<string> filesImported);
    }
}
