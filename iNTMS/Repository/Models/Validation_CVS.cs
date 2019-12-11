using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

namespace Repository.Models
{
    public class Validation_CVS
    {
        /// <summary>
        /// Validate and correct Errors for file lines
        /// </summary>
        /// <param name="Line"></param>
        /// <returns></returns>
        public string Validate(string Line)
        {
            string ID, StudentID, StudentName, Gender, Email, KnowUsID, FrameworkUse, Problem, ExAppAlone, SpecializeID, Intro, ExpectedLocationID, ExAppTeam;
            string csvData = Line; int value;

            //Regular Expression to Validate Mobile Number
            Regex rx = new Regex(@"^[0-9]{8,15}$");

            // Remove the etra ',' and replace yes with true
            csvData = Fix(csvData);

            // pass data to an array
            string[] csvCol = csvData.Split(',');

            //assign varibales
            ID = csvCol[0];
            StudentID = csvCol[1]; StudentName = csvCol[2];
            Gender = csvCol[3]; Email = csvCol[4]; KnowUsID = csvCol[5]; FrameworkUse = csvCol[6];
            Problem = csvCol[7]; ExAppAlone = csvCol[8]; SpecializeID = csvCol[9]; Intro = csvCol[10];
            ExpectedLocationID = csvCol[11];  ExAppTeam = csvCol[13];
            

            // assign values to its right variables
            //for (int i = 3; i < csvCol.Length; i++)
            //{
            //    if (csvCol[i].Length <= 2 && int.TryParse(csvCol[i], out value))
            //        Age = csvCol[i];

            //    if (csvCol[i].Length == 1 && (csvCol[i] == "M" || csvCol[i] == "F"))
            //        Sex = csvCol[i];

            //    if (rx.IsMatch(csvCol[i]))
            //        Mobile = csvCol[i];

            //    if (csvCol[i].ToLower() == "true" || csvCol[i].ToLower() == "false")
            //        Active = csvCol[i].ToLower();

            //}
            //rewrite the line
            csvData = ID + "," + StudentID + "," + StudentName + "," + Gender + "," + Email + "," + KnowUsID + "," + FrameworkUse + "," + Problem + "," + ExAppAlone + "," + SpecializeID + "," + Intro + "," + ExpectedLocationID + "," + ExAppTeam;
            
            return csvData;
        }

        private string Fix(string str)
        {
            if (str.EndsWith(","))
                str = str.Remove(str.Length - 1, 1);

            str = str.Replace("Yes", "True").Replace("No", "False");

            return str;
        }
    }
}
