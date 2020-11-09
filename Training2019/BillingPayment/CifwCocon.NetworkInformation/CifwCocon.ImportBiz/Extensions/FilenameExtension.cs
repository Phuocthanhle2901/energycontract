using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace CifwCocon.ImportBiz.Extensions
{
    public static class FileNameExtension
    {
        private static int positionOrder = 1;
        private static int positionDatetime = 2;

        /// <summary>
        /// Get part Datetime FileName CAIWAFKOOP-5-03122018-20.03 -> 03122018
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static DateTime GetDateTimePart(this String str, int PartNameAfterSplit)
        {
            var parts = str.Split('-');
            if (parts.Length == PartNameAfterSplit)
            {
                //for case file name CAIW-AFKOOP-5-03122018-20.03
                return DateTime.ParseExact(parts[positionDatetime + 1], "ddMMyyyy", CultureInfo.InvariantCulture, DateTimeStyles.None);
            }

            //for case file name CAIWAFKOOP-5-03122018-20.03
            return DateTime.ParseExact(parts[positionDatetime], "ddMMyyyy", CultureInfo.InvariantCulture, DateTimeStyles.None);
        }

        /// <summary>
        /// Get part Order FileName CAIWAFKOOP-5-03122018-20.03 -> 5
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static int GetOrderPart(this String str, int PartNameAfterSplit)
        {
            var parts = str.Split('-');
            if (parts.Length == PartNameAfterSplit)
            {
                //for case file name CAIW-AFKOOP-5-03122018-20.03
                return int.Parse(parts[positionOrder + 1]);
            }

            //for case file name CAIWAFKOOP-5-03122018-20.03
            return int.Parse(parts[positionOrder]);
        }
    }
}
