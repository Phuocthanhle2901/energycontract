using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Repository;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.GUIs
{
    public class ImportExcelsController : Controller
    {
        // GET: ImportExcel
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(ImportExcel importExcel)
        {
            if (ModelState.IsValid)
            {
                string path = Server.MapPath("~/Content/Upload/" + importExcel.file.FileName);
                importExcel.file.SaveAs(path);

                string excelConnectionString = @"Provider='Microsoft.ACE.OLEDB.12.0';Data Source='" + path + "';Extended Properties='Excel 12.0 Xml;IMEX=1'";
                OleDbConnection excelConnection = new OleDbConnection(excelConnectionString);

                //Sheet Name
                excelConnection.Open();
                string tableName = excelConnection.GetSchema("Tables").Rows[0]["TABLE_NAME"].ToString();
                excelConnection.Close();
                //End

                OleDbCommand cmd = new OleDbCommand("Select * from [" + tableName + "]", excelConnection);

                excelConnection.Open();

                OleDbDataReader dReader;
                dReader = cmd.ExecuteReader();
                SqlBulkCopy sqlBulk = new SqlBulkCopy(ConfigurationManager.ConnectionStrings["IFD_InternsManagement_Team"].ConnectionString);

                //Give your Destination table name
                sqlBulk.DestinationTableName = "StudentCV";

                //Mappings
                sqlBulk.ColumnMappings.Add("StudentID", "StudentID");
                sqlBulk.ColumnMappings.Add("Email", "Email");
                sqlBulk.ColumnMappings.Add("KnowUsID", "KnowUsID");
                sqlBulk.ColumnMappings.Add("FrameworkUse", "FrameworkUse");
                sqlBulk.ColumnMappings.Add("Problem", "Problem");
                sqlBulk.ColumnMappings.Add("ExAppAlone", "ExAppAlone");
                sqlBulk.ColumnMappings.Add("SpecializeID", "SpecializeID");
                sqlBulk.ColumnMappings.Add("Intro", "Intro");
                sqlBulk.ColumnMappings.Add("ExpectedLocationID", "ExpectedLocationID");
                sqlBulk.ColumnMappings.Add("InternStartDate", "InternStartDate");
                sqlBulk.ColumnMappings.Add("ExAppTeam", "ExAppTeam");
                sqlBulk.ColumnMappings.Add("Status", "Status");
                sqlBulk.ColumnMappings.Add("InterviewSchedule","InterviewSchedule");
                sqlBulk.ColumnMappings.Add("StudentName", "StudentName");
                sqlBulk.ColumnMappings.Add("Gender", "Gender");

                sqlBulk.WriteToServer(dReader);
                excelConnection.Close();

                ViewBag.Result = "Successfully Imported";
            }
            return View();
        }

        [HttpPost]
        public ActionResult Reset()
        {
            Session["ExcelData"] = null;
            return RedirectToAction("Index");
        }
    }

}