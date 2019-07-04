using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Repository.DAL;
using Repository.Models;
using System.Data;
using System.Configuration;
using System.Data.SqlClient;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.GUIs
{
    public class ImportCSVsController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        // Post: Import       
        [HttpPost]
        public ActionResult Index(HttpPostedFileBase postedFile)
        {
            string filePath = string.Empty;
            if (postedFile != null)
            {
                string path = Server.MapPath("~/Content/Upload/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                filePath = path + Path.GetFileName(postedFile.FileName);
                string extension = Path.GetExtension(postedFile.FileName);
                postedFile.SaveAs(filePath);
                //Create a DataTable.
                DataTable dt = new DataTable();
                dt.Columns.AddRange(new DataColumn[16] { new DataColumn("ID", typeof(int)),
                                new DataColumn("StudentID",typeof(string)),
                                new DataColumn("StudentName", typeof(string)),
                                new DataColumn("Gender",typeof(string)),
                                new DataColumn("Email", typeof(string)),
                                new DataColumn("KnowUsID",typeof(int)),
                                new DataColumn("FrameworkUse", typeof(string)),
                                new DataColumn("Problem",typeof(string)),
                                new DataColumn("ExAppAlone", typeof(string)),
                                new DataColumn("SpecializeID",typeof(string)),
                                new DataColumn("Intro", typeof(string)),
                                new DataColumn("ExpectedLocationID",typeof(int)),
                                new DataColumn("InternStartDate", typeof(DateTime)),
                                new DataColumn("ExAppTeam",typeof(string)),
                                new DataColumn("Status", typeof(string)),
                                new DataColumn("InterviewSchedule",typeof(DateTime)) });


                //Read the contents of CSV file.
                string csvData = System.IO.File.ReadAllText(filePath);

                //Execute a loop over the rows.
                foreach (string row in csvData.Split('\n'))
                {
                    if (!string.IsNullOrEmpty(row))
                    {
                        dt.Rows.Add();
                        int i = 0;

                        //Execute a loop over the columns.
                        foreach (string cell in row.Split(','))
                        {
                            dt.Rows[dt.Rows.Count - 1][i] = cell;
                            i++;
                        }
                    }
                }

                string conString = ConfigurationManager.ConnectionStrings["IFD_InternsManagement_Team"].ConnectionString;
                using (SqlConnection con = new SqlConnection(conString))
                {
                    using (SqlBulkCopy sqlBulkCopy = new SqlBulkCopy(con))
                    {
                        //Set the database table name.
                        sqlBulkCopy.DestinationTableName = "dbo.StudentCV";

                        //[OPTIONAL]: Map the DataTable columns with that of the database table   
                        sqlBulkCopy.ColumnMappings.Add("ID", "ID");
                        sqlBulkCopy.ColumnMappings.Add("StudentID", "StudentID");
                        sqlBulkCopy.ColumnMappings.Add("StudentName", "StudentName");
                        sqlBulkCopy.ColumnMappings.Add("Gender", "Gender");
                        sqlBulkCopy.ColumnMappings.Add("Email", "Email");
                        sqlBulkCopy.ColumnMappings.Add("KnowUsID", "KnowUsID");
                        sqlBulkCopy.ColumnMappings.Add("FrameworkUse", "FrameworkUse");
                        sqlBulkCopy.ColumnMappings.Add("Problem", "Problem");
                        sqlBulkCopy.ColumnMappings.Add("ExAppAlone", "ExAppAlone");
                        sqlBulkCopy.ColumnMappings.Add("SpecializeID", "SpecializeID");
                        sqlBulkCopy.ColumnMappings.Add("Intro", "Intro");
                        sqlBulkCopy.ColumnMappings.Add("ExpectedLocationID", "ExpectedLocationID");
                        sqlBulkCopy.ColumnMappings.Add("InternStartDate", "InternStartDate");
                        sqlBulkCopy.ColumnMappings.Add("ExAppTeam", "ExAppTeam");
                        sqlBulkCopy.ColumnMappings.Add("Status", "Status");
                        sqlBulkCopy.ColumnMappings.Add("InterviewSchedule", "InterviewSchedule");

                        con.Open();
                        sqlBulkCopy.WriteToServer(dt);
                        con.Close();
                    }
                }
            }

            return View();
        }
    }
}