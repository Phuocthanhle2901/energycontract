using System;
using System.Collections.Generic;
using System.Text;

namespace CifwCocon.NetworkInformation.Bo
{
    public class TextProperty
    {
        public string Key { get; set; }
        public string Value { get; set; }

        public override string ToString()
        {
            return $"{Key} : {Value}";
        }

        public static string GetString(List<TextProperty> textProperties, string delimiter)
        {
            var strBuilder = new StringBuilder();
            foreach (var textProperty in textProperties)
            {
                strBuilder.Append(delimiter).Append(textProperty.ToString());
            }

            return strBuilder.ToString();
        }
    }
}
