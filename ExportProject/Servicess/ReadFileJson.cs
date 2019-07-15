namespace Services
{
    public class ReadFileJson
    {
        public string connectionString;
        public string name;
        public string host;
        public string password;
        public string strSource;
        public string strDesPath;
        public string fileName;
        public string format;
        public  ReadFileJson()
        {
            GetValueJson getValueJson = new GetValueJson();
            connectionString = getValueJson.GetConfiguration("Data:ConnectionString");
            name = getValueJson.GetConfiguration("SftpConfig:name");
            host = getValueJson.GetConfiguration("SftpConfig:host");
            password = getValueJson.GetConfiguration("SftpConfig:pass");
            strSource = getValueJson.GetConfiguration("UploadSftp:strSource");
            strDesPath = getValueJson.GetConfiguration("UploadSftp:strDesPath");
            fileName = getValueJson.GetConfiguration("UploadSftp:fileName");
            format = getValueJson.GetConfiguration("UploadSftp:format");
        }
    }
}
