using CoconService;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace CifwCocon.Utility
{
    public class Helpers
    {
        public static string GetProperty(List<FieldValue> properties, string fieldName)
        {
            var field = properties.Where(t => t.Field == fieldName).FirstOrDefault();
            if(field != null && field.Value != null)
            {
                return field.Value.ToString();
            }
            return string.Empty;
        }

        public static string GetAggrFieldValue(FieldValue[] records, string fieldName, int fiberNo)
        {
            var field = records.FirstOrDefault(q => q.Field == fieldName);
            if (field != null && field.Value != null && field.Value is EntityRecordSet)
            {
                var valueSet = field.Value as EntityRecordSet;
                var index = fiberNo - 1;
                if (valueSet != null && valueSet.Records != null &&
                    valueSet.Records.Length > index &&
                    valueSet.Records[index] != null &&
                    valueSet.Records[index].Values != null &&
                    valueSet.Records[index].Values.Length > 0 &&
                    valueSet.Records[index].Values[0] != null &&
                    valueSet.Records[index].Values[0].Value != null)
                {
                    return valueSet.Records[index].Values[0].Value.ToString();
                }
            }
            return string.Empty;
        }

        public static List<string> GetAggrFieldValues(FieldValue[] records, string fieldName)
        {
            List<string> result = new List<string>();
            var field = records.FirstOrDefault(q => q.Field == fieldName);
            if (field != null && field.Value != null && field.Value is EntityRecordSet)
            {
                var valueSet = field.Value as EntityRecordSet;
                                
                if (valueSet != null && valueSet.Records != null &&
                    valueSet.Records.Length > 0)
                {
                    foreach(var item in valueSet.Records)
                    {
                        result.Add(item.Values[0].Value.ToString());
                    }                    
                }
            }
            return result;
        }
    }
}
