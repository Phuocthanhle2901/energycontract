using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using OfficeOpenXml;
using PagedList;
using QLThucTap_INFOdation.BusinessLogic.IService;
using QLThucTap_INFOdation.BusinessLogic.Service;
using Repository.DAL;
using Repository.Models;
using Rotativa;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.GUIs
{
    public class StudentController : Controller
    {
        // GET: ManagerMVC
        private InternContext db = new InternContext();
        private readonly IUserPermissionService _userpermission;

        string url = "http://localhost:54224/api/studentapi";
        HttpClient client;
        public StudentController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        private bool IsHaveCreateStudent()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Create Student") || findper.Contains("Full All Access") || findper.Contains("Full On Student"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveUpdateStudent()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Update Student") || findper.Contains("Full All Access") || findper.Contains("Full On Student"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveReadStudent()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Read Student") || findper.Contains("Full All Access") || findper.Contains("Full On Student"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveDeleteStudent()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Delete Student") || findper.Contains("Full All Access") || findper.Contains("Full On Student"))
            {
                return true;
            }
            return false;
        }

        public IList<StudentViewModel> GetStudentList()
        {
            InternContext db = new InternContext();
            var studentList = (from e in db.Students
                               select new StudentViewModel
                               {
                                   StudentID = e.StudentID,
                                   Name = e.Name,
                                   Birthday = (DateTime)e.Birthday,
                                   Email = e.Email,
                                   Address = e.Address,
                                   PhoneNumber = e.PhoneNumber,
                                   Unit = e.Unit,
                                   Info = e.Info,
                                   DateCreated = e.DateCreated,
                                   LastUpdated = e.LastUpdated,
                                   Gender = e.Gender,
                                   ProgressID = e.ProgressID,
                               }).ToList();
            return studentList;
        }
        public ActionResult ExportView()
        {
            return View(this.GetStudentList());
        }
        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index()
        {
            if (IsHaveReadStudent())
            {
                var lststudents = db.Students.ToList<Student>();
                return View(lststudents);
            }
            else
                return View("ErrorFunction");
        }        
        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (IsHaveReadStudent())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<Student>(responseData);
                    return View(usr);
                }
                return RedirectToAction("IDNotFound", "Error", new { area = "" });
            }

            return View("ErrorFunction");
        }
        // GET: mvcusers/Create
        public ActionResult Create()
        {
            if (IsHaveCreateStudent())
            {
                Student manager = new Student();
                manager.ProgressCollection = db.Progresses.ToList<Progress>();         
                return View(manager);
            }
            else
                return View("ErrorFunction");
        }

        // POST: mvcusers/Create        
        [HttpPost]
        public async Task<ActionResult> Create(Student usr)
        {
            var isExist = IsEmailExist(usr.Email);
            if (isExist)
            {
                ModelState.AddModelError(string.Empty, "Email already exist");
                return View(usr);
            }
            HttpResponseMessage responseMessage = await client.PostAsJsonAsync(url, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                //SendVerificationLinkEmail(usr.StudentID, usr.Email, "CreateAccountSuccess");
                return RedirectToAction("Index");
            }
            //return RedirectToAction("Error");
            ModelState.AddModelError(string.Empty, "Please fill in the correct information!");
            return View(usr);
        }


        // GET: mvcusers/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (IsHaveUpdateStudent())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<Student>(responseData);

                    return View(usr);
                }
                return RedirectToAction("IDNotFound", "Error", new { area = "" });
            }

            return View("ErrorFunction");
        }

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit(string id, Student usr)
        {
            string ef = "CreateAccountSuccess";
            List<string> lstEFS = new List<string>();
            List<string> lstEFB1 = new List<string>();
            List<string> lstEFB2 = new List<string>();
            List<string> lstEFB3 = new List<string>();
            List<string> lstEFB4 = new List<string>();
            var emailFor = from e in db.EmailTemplates where e.EmailFor == ef select e;
            foreach (var item in emailFor)
            {
                lstEFS.Add(item.Subject);
            }
            foreach (var item in emailFor)
            {
                lstEFB1.Add(item.Body1);
                lstEFB2.Add(item.Body2);
                lstEFB3.Add(item.Body3);
                lstEFB4.Add(item.Body4);
            }
            HttpResponseMessage responseMessage = await client.PutAsJsonAsync(url + "/" + id, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                foreach (var subject in lstEFS)
                {
                    foreach (var body1 in lstEFB1)
                    {
                        foreach (var body2 in lstEFB2)
                        {
                            foreach (var body3 in lstEFB3)
                            {
                                foreach (var body4 in lstEFB4)
                                {
                                    SendVerificationLinkEmail(usr.Email, subject, body1 + body2 + usr.StudentID + body3 + body4, "CreateAccountSuccess");
                                }
                            }
                        }
                    }
                }
                //SendVerificationLinkEmail(usr.StudentID, usr.Email, "CreateAccountSuccess");
                return RedirectToAction("Index");
            }
            //return RedirectToAction("Error");
            ModelState.AddModelError(string.Empty, "Please fill in the correct information!");

            return View(usr);
        }

        public async Task<ActionResult> Delete(string id)
        {
            if (IsHaveDeleteStudent())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<Student>(responseData);

                    return View(usr);
                }
                return RedirectToAction("IDNotFound", "Error", new { area = "" });
            }

            return View("ErrorFunction");
        }
        //The DELETE method
        [HttpPost]
        public async Task<ActionResult> Delete(string id, Student usr)
        {

            HttpResponseMessage responseMessage = await client.DeleteAsync(url + "/" + id);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("Index");
            }
            return RedirectToAction("ErrorFunction");
        }
        //public ActionResult DetailsCertify(string id)
        //{
        //    var emp = db.Students.Where(e => e.StudentID == id).First();
        //    return View(emp);
        //}
        //public ActionResult PrintCertify(string id)
        //{
        //    var report = new ActionAsPdf("DetailsCertify", new { id = id });
        //    return report;
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        [NonAction]
        public void SendVerificationLinkEmail(string email, string subject, string body, string emailFor = "CreateAccountSuccess")
        {
            var fromEmail = new MailAddress("mariobolobala@gmail.com", "mario bolobala");
            var toEmail = new MailAddress(email);
            var fromEmailPassword = "tranhuutich1";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromEmail.Address, fromEmailPassword)
            };

            using (var message = new MailMessage(fromEmail, toEmail)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            })
                smtp.Send(message);
        }
        [NonAction]
        public bool IsEmailExist(string email)
        {
            using (InternContext dc = new InternContext())
            {
                var v = dc.Students.Where(a => a.Email == email).FirstOrDefault();
                return v != null;
            }
        }
        public ActionResult ExportToExcel()
        {
            var gv = new GridView();
            gv.DataSource = this.GetStudentList();
            gv.DataBind();
            Response.ClearContent();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment; filename=StudentExcel.xls");
            Response.ContentType = "application/ms-excel";
            Response.Charset = "";
            StringWriter objStringWriter = new StringWriter();
            HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
            gv.RenderControl(objHtmlTextWriter);
            Response.Output.Write(objStringWriter.ToString());
            Response.Flush();
            Response.End();
            return View("ExportView");
        }
        public ActionResult ExportData()
        {
            string val = Request["Export"].ToString();
            List<Student> lst = db.Students.ToList();

            if (val.ToLower() == "xls")
            {
                GridView gv = new GridView();
                gv.DataSource = db.Students.ToList();
                gv.DataBind();
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=StudentList.xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter sw = new StringWriter();
                HtmlTextWriter htw = new HtmlTextWriter(sw);
                gv.RenderControl(htw);
                Response.Output.Write(sw.ToString());
                Response.Flush();
                Response.End();
            }
            else if (val.ToLower() == "csv")
            {
                StringBuilder sb = new StringBuilder();
                string[] columns = new string[12] { "StudentID", "Name", "Birthday", "Email", "Address", "PhoneNumber", "Unit", "Info", "DateCreated", "LastUpdated", "Gender", "ProgressID" };
                for (int k = 0; k < columns.Length; k++)
                {
                    //add separator
                    sb.Append(columns[k].ToString() + ',');
                }

                sb.Append("\r\n");
                foreach (Student item in lst)
                {
                    sb.Append(item.StudentID + ",");
                    sb.Append(item.Name + ",");
                    sb.Append(item.Birthday + ",");
                    sb.Append(item.Email + ",");
                    sb.Append(item.Address + ",");
                    sb.Append(item.PhoneNumber + ",");
                    sb.Append(item.Unit + ",");
                    sb.Append(item.Info + ",");
                    sb.Append(item.DateCreated + ",");
                    sb.Append(item.LastUpdated + ",");
                    sb.Append(item.Gender + ",");
                    sb.Append(item.ProgressID + ",");


                    //append new line
                    sb.Append("\r\n");
                }
                Response.Clear();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment;filename=StudentList.csv");
                Response.Charset = "";
                Response.ContentType = "application/text";
                Response.Output.Write(sb.ToString());
                Response.Flush();
                Response.End();
            }
            else if (val.ToLower() == "xlsx")
            {
                var data = from stuDetails in lst
                           select new
                           {
                               StudentID = stuDetails.StudentID,
                               Name = stuDetails.Name,
                               Birthday = stuDetails.Birthday,
                               Email = stuDetails.Email,
                               Address = stuDetails.Address,
                               PhoneNumber = stuDetails.PhoneNumber,
                               Unit = stuDetails.Unit,
                               Info = stuDetails.Info,
                               Gender = stuDetails.Gender,
                               ProgressID = stuDetails.ProgressID
                           };
                ExcelPackage excel = new ExcelPackage();
                var workSheet = excel.Workbook.Worksheets.Add("Sheet1");
                workSheet.Cells[1, 1].LoadFromCollection(data, true);
                using (var memoryStream = new MemoryStream())
                {
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment; filename=StudentList.xlsx");
                    excel.SaveAs(memoryStream);
                    memoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }

            return RedirectToAction("Index");
        }
    }
}
