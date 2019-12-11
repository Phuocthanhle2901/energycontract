using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using PagedList;
using Repository.DAL;
using Repository.Models;
using QLThucTap_INFOdation.BusinessLogic.IService;
using QLThucTap_INFOdation.BusinessLogic.Service;
using System.Net.Mail;
using System.Net;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.GUIs
{
    public class ProjectInternManagersController : Controller
    {
        // GET: ManagerMVC        
        private readonly IUserPermissionService _userpermission;
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/projectinternmanagerapi";
        HttpClient client;
        public ProjectInternManagersController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        private bool IsHaveCreateProjectInternManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Create Project Intern Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Project Intern Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveUpdateProjectInternManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Update Project Intern Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Project Intern Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveReadProjectInternManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Read Project Intern Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Project Intern Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveDeleteProjectInternManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Delete Project Intern Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Project Intern Manager"))
            {
                return true;
            }
            return false;
        }

        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index()
        {
            if (IsHaveReadProjectInternManager())
            {
                var lstprojectinternmanager = db.ProjectInternManagers.ToList<ProjectInternManager>();
                return View(lstprojectinternmanager);
            }
            else
                return View("ErrorFunction");
        }

        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (IsHaveReadProjectInternManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<ProjectInternManager>(responseData);
                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        // GET: mvcusers/Create
        public ActionResult Create()
        {
            if (IsHaveCreateProjectInternManager())
            {
                ProjectInternManager manager = new ProjectInternManager();
                manager.ProjectInternCollection = db.ProjectInterns.ToList<ProjectIntern>();
                manager.ManagerCollection = db.Managers.ToList<Manager>();
                List<Student> lststudent = new List<Student>();

                var s = from st in db.Students where st.ProgressID == "PROGRESS_001" select st;

                var query = from t in db.ProjectInternManagers
                            join p in db.ProjectInterns on t.ProjectInternID equals p.ProjectInternID
                            join std in db.Students on t.StudentID equals std.StudentID
                            select std;

                var query1 = from t in db.ProjectInternManagers
                             join p in db.ProjectInterns on t.ProjectInternID equals p.ProjectInternID
                             join std in db.Students on t.StudentID equals std.StudentID
                             where !t.IsPass
                             select std;

                var query2 = s.Except(query);

                var query3 = query.Except(query1);

                foreach (var item in query2)
                {
                    lststudent.Add(item);
                }

                foreach (var item in query3)
                {
                    lststudent.Add(item);
                }

                manager.StudentCollection = lststudent;
                manager.InternshipCollection = db.Internships.ToList<Internship>();
                return View(manager);
            }
            else
                return View("ErrorFunction");

        }

        // POST: mvcusers/Create

        [HttpPost]
        public async Task<ActionResult> Create(ProjectInternManager usr)
        {
            string ef = "CreateProjectInternNotification";
            string std = Request.Form["StudentID"].ToString();
            string mng = Request.Form["ManagerID"].ToString();
            string pi = Request.Form["ProjectInternID"].ToString();
            List<string> lstEmail = new List<string>();
            List<string> lstSTD = new List<string>();
            List<string> lstMNG = new List<string>();
            List<string> lstPI = new List<string>();
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
            var emailStudent = from t in db.Students where t.StudentID == std select t;
            foreach (var item in emailStudent)
            {
                lstEmail.Add(item.Email);
            }
            foreach (var item in emailStudent)
            {
                lstSTD.Add(item.Name);
            }

            var emailManager = from t in db.Managers where t.ManagerID == mng select t;
            foreach (var item in emailManager)
            {
                lstEmail.Add(item.Email);
            }
            foreach (var item in emailManager)
            {
                lstMNG.Add(item.Name);
            }
            var projectIntern = from t in db.ProjectInterns where t.ProjectInternID == pi select t;
            foreach (var item in projectIntern)
            {
                lstPI.Add(item.ProjectInternName);
            }
            HttpResponseMessage responseMessage = await client.PostAsJsonAsync(url, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                //Gui mail
                //var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                foreach (var Email in lstEmail)
                {
                    foreach (var pii in lstPI)
                    {
                        foreach (var mngg in lstMNG)
                        {
                            foreach (var stdd in lstSTD)
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
                                                    SendVerificationLinkEmail(Email, subject, body1 + pii + body2 + stdd + body3 + mngg + body4 + DateTime.Now.ToString(), ef);
                                                    foreach (var Emaill in db.SuperManagers.Select(e => e.Email).ToList())
                                                    {
                                                        SendVerificationLinkEmail(Emaill, subject, body1 + pii + body2 + stdd + body3 + mngg + body4 + DateTime.Now.ToString(), ef);
                                                    }
                                                }
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
                return RedirectToAction("Index");

            }
            //return RedirectToAction("Error");
            ModelState.AddModelError(string.Empty, "Vui lòng điền đúng thông tin");

            return View(usr);
        }


        // GET: mvcusers/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (IsHaveUpdateProjectInternManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var manager = JsonConvert.DeserializeObject<ProjectInternManager>(responseData);
                    manager.ProjectInternCollection = db.ProjectInterns.ToList<ProjectIntern>();
                    manager.ManagerCollection = db.Managers.ToList<Manager>();

                    manager.StudentCollection = db.Students.ToList<Student>();
                    manager.InternshipCollection = db.Internships.ToList<Internship>();
                    return View(manager);
                }
            }

            return View("ErrorFunction");
        }

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit(string id, ProjectInternManager usr)
        {
            string ef = "PassProjectInternNotification";
            List<string> lstEmail = new List<string>();
            List<string> lstSTD = new List<string>();
            List<string> lstMNG = new List<string>();
            List<string> lstPI = new List<string>();
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
            var emailStudent = from t in db.ProjectInternManagers
                               join p in db.ProjectInterns on t.ProjectInternID equals p.ProjectInternID
                               join std in db.Students on t.StudentID equals std.StudentID
                               where t.ProjectInternManagerID == usr.ProjectInternManagerID
                               select std;
            var projectIntern = from t in db.ProjectInternManagers
                                join p in db.ProjectInterns on t.ProjectInternID equals p.ProjectInternID
                                where t.ProjectInternManagerID == usr.ProjectInternManagerID
                                select p;
            foreach (var item in projectIntern)
            {
                lstPI.Add(item.ProjectInternName);
            }
            foreach (var item in emailStudent)
            {
                lstEmail.Add(item.Email);
            }
            foreach (var item in emailStudent)
            {
                lstSTD.Add(item.Name);
            }
            var emailManager = from t in db.ProjectInternManagers
                               join p in db.ProjectInterns on t.ProjectInternID equals p.ProjectInternID
                               join mng in db.Managers on t.ManagerID equals mng.ManagerID
                               where t.ProjectInternManagerID == usr.ProjectInternManagerID
                               select mng;

            foreach (var item in emailManager)
            {
                lstEmail.Add(item.Email);
            }
            foreach (var item in emailManager)
            {
                lstMNG.Add(item.Name);
            }
            HttpResponseMessage responseMessage = await client.PutAsJsonAsync(url + "/" + id, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                //Auto update Progress
                var temp1 = from t in db.ProjectInternManagers
                            join std in db.Students on t.StudentID equals std.StudentID
                            where usr.StudentID == std.StudentID
                            select t;
                int count = 0;
                foreach (var item in temp1)
                {
                    if (item.IsPass)
                    {
                        count++;
                    }
                }

                var temp3 = from std in db.Students
                            where std.StudentID == usr.StudentID
                            select std;
                if (count >= 1)
                {
                    temp3.FirstOrDefault().ProgressID = "PROGRESS_002";
                    db.SaveChanges();
                }
                else
                {
                    temp3.FirstOrDefault().ProgressID = "PROGRESS_001";
                    db.SaveChanges();
                }

                //Gui mail thong bao
                if (usr.IsPass == true)
                {
                    foreach (var Email in lstEmail)
                    {
                        foreach (var pi in lstPI)
                        {
                            foreach (var mng in lstMNG)
                            {
                                foreach (var std in lstSTD)
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
                                                        SendVerificationLinkEmail(Email, subject, body1 + pi + body2 + std + body3 + mng + body4 + DateTime.Now.ToString(), ef);
                                                        foreach (var Emaill in db.SuperManagers.Select(e => e.Email).ToList())
                                                        {
                                                            SendVerificationLinkEmail(Emaill, subject, body1 + pi + body2 + std + body3 + mng + body4 + DateTime.Now.ToString(), ef);
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }

                        //SendVerificationLinkEmail(Email, pin, usr.ManagerID, usr.StudentID, "ProjectInternPassNotification");
                        //SendVerificationLinkEmail(Email, "ProjectInternPassNotification");
                    }
                }

                return RedirectToAction("Index");
            }
            //return RedirectToAction("Error");
            ModelState.AddModelError(string.Empty, "Vui lòng điền đúng thông tin");

            return View(usr);
        }

        public async Task<ActionResult> Delete(string id)
        {
            if (IsHaveDeleteProjectInternManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<ProjectInternManager>(responseData);

                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        //The DELETE method
        [HttpPost]
        public async Task<ActionResult> Delete(string id, ProjectInternManager usr)
        {

            HttpResponseMessage responseMessage = await client.DeleteAsync(url + "/" + id);
            if (responseMessage.IsSuccessStatusCode)
            {
                //AutoUpdateProgressOnProjectIntern(usr);
                return RedirectToAction("Index");
            }
            return RedirectToAction("Error");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        [NonAction]
        public void SendVerificationLinkEmail(string email, string subject, string body, string emailFor = "CreateProjectInternNotification")
        //public void SendVerificationLinkEmail(string email, string emailFor = "CreateProjectInternNotification")
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
    }
}
