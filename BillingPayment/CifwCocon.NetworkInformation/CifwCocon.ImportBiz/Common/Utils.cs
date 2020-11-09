using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace CifwCocon.ImportBiz.Common
{
    public static class Utils
    {
        public enum Message
        {
            [Description("{0} is required")]
            Required,
            [Description("{0} does not match")]
            DoesNotMatch,
            [Description("{0} wrong format")]
            WrongFormat
        }

        public static string GetDescription<T>(this T @enum, params object[] parammeters)
        {
            var result = string.Empty;
            var type = @enum.GetType();
            if (type.IsEnum)
            {
                var memberInfo = type.GetMember(@enum.ToString());
                if (memberInfo != null && memberInfo.Length > 0)
                {
                    var attrs = memberInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);

                    if (attrs != null && attrs.Length > 0)
                    {
                        result = parammeters.Length > 0 ? string.Format(((DescriptionAttribute)attrs[0]).Description, parammeters) : ((DescriptionAttribute)attrs[0]).Description;
                    }
                }
            }
            return result;
        }
        public static bool ValidateZipcode(string zipcode)
        {
            if (string.IsNullOrEmpty(zipcode) || zipcode.Length > 6) return false;
            var regex = new Regex(@"[0-9]{4}[A-Z]{2}$");
            return regex.IsMatch(zipcode);
        }
        public static void MoveFileToBackup(FileInfo fileInfo)
        {
            if(string.IsNullOrEmpty(fileInfo.FullName) && string.IsNullOrEmpty(fileInfo.Name)) return;
            var pathBackupFolder = $"{Path.GetDirectoryName(fileInfo.FullName)}/backup";
            if (!Directory.Exists(pathBackupFolder))
            {
                Directory.CreateDirectory(pathBackupFolder);
            }
            //check exited file in backup folder
            var pathFileBackup = $"{Path.GetDirectoryName(fileInfo.FullName)}/backup/{fileInfo.Name}";
            if (File.Exists(pathFileBackup))
            {
                File.Delete(pathFileBackup);
            }
            // To move a file or folder to a new location:
            File.Move(fileInfo.FullName, $"{pathBackupFolder}/{fileInfo.Name}");
        }

        public static string[] SplitCsvRow(this string value, string delimiter)
        {
            var csvParser = new Regex($"{delimiter}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
            //var fields = csvParser.Split(value, "(\"[^\"]*\"|[^\"\\s]+)(\\s+|$)");
            var fields = csvParser.Split(value);
            return fields.Select(s=>s.Trim('\"')).ToArray();
        }
    }
}
