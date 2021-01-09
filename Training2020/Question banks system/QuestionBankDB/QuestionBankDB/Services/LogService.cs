using System;
using System.IO;

namespace QuestionBankDB.Services
{
    public class LogService
    {
        private string path = "Logs";
        private DateTime time = DateTime.Now;
        public LogService()
        {
            path += "/" + time.ToString("yyyy_MM_dd") + ".txt";
        }

        public void Log(string Module, string Feature, string Activity, string Result)
        {
            TextWriter log = new StreamWriter(path, true);
            //using interpolation format
            string record = $"[{time.ToString("dd/MM/yyyy HH:mm:ss")}] [{Module}] [{Feature}] [{Activity}] [Result: {Result}]";
            log.WriteLine(record);
            log.Close();
        }
    }
}