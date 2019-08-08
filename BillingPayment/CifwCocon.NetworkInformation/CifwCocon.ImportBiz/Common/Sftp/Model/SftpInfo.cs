using Renci.SshNet;

namespace CifwCocon.ImportBiz.Common.Sftp.Model
{
    public class SftpInfo : FtpBaseInfo
    {
        public PrivateKeyFile[] KeyFiles { get; set; }
        public string DownloadPath { get; set; }
        public string SavePath { get; set; }
        public string Delimiter { get; set; }
        public bool IsActive { get; set; }
    }
}
