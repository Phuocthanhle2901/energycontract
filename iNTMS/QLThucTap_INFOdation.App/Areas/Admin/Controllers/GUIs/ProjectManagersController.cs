using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using PagedList;
using QLThucTap_INFOdation.BusinessLogic.IService;
using QLThucTap_INFOdation.BusinessLogic.Service;
using Repository.DAL;
using Repository.Models;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.GUIs
{
    public class ProjectManagerController : Controller
    {
        // GET: ManagerMVC
        private readonly IUserPermissionService _userpermission;
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/projectmanagerapi";
        HttpClient client;
        public ProjectManagerController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        private bool IsHaveCreateProjectManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Create Project Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Project Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveUpdateProjectManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Update Project Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Project Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveReadProjectManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Read Project Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Project Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveDeleteProjectManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Delete Project Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Project Manager"))
            {
                return true;
            }
            return false;
        }

        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index()
        {
            if (IsHaveReadProjectManager())
            {
                var lstprojectmanager = db.ProjectManagers.ToList<ProjectManager>();
                return View(lstprojectmanager);
            }
            else
                return View("ErrorFunction");
        }

        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (IsHaveReadProjectManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<ProjectManager>(responseData);
                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        // GET: mvcusers/Create
        public ActionResult Create()
        {
            if (IsHaveCreateProjectManager())
            {
                ProjectManager manager = new ProjectManager();
                manager.ProjectCollection = db.Projects.ToList<Project>();
                manager.ManagerCollection = db.Managers.ToList<Manager>();
                List<Student> lststudent = new List<Student>();

                var s = from st in db.Students where st.ProgressID == "PROGRESS_002" select st;

                var query1 = from t in db.ProjectManagers
                             join p in db.Projects on t.ProjectID equals p.ProjectID
                             join std in db.Students on t.StudentID equals std.StudentID
                             where !t.IsPass
                             select std;

                var query2 = s.Except(query1);


                foreach (var item in query2)
                {
                    lststudent.Add(item);
                }

                manager.StudentCollection = lststudent;
                return View(manager);
            }
            else
                return View("ErrorFunction");

        }

        // POST: mvcusers/Create

        [HttpPost]
        public async Task<ActionResult> Create(ProjectManager usr)
        {
            //var isExist = IsEmailExist(usr.StudentID);
            //if (isExist)
            //{
            //    ModelState.AddModelError(string.Empty, "Email already exist");
            //    return View(usr);
            //}
            string ef = "CreateProjectNotification";
            string std = Request.Form["StudentID"].ToString();
            string mng = Request.Form["ManagerID"].ToString();
            string pi = Request.Form["ProjectID"].ToString();
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
            var project = from t in db.Projects where t.ProjectID == pi select t;
            foreach (var item in project)
            {
                lstPI.Add(item.ProjectName);
            }
            HttpResponseMessage responseMessage = await client.PostAsJsonAsync(url, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                //Gui mail
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
            if (IsHaveUpdateProjectManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var manager = JsonConvert.DeserializeObject<ProjectManager>(responseData);
                    manager.ProjectCollection = db.Projects.ToList<Project>();
                    manager.ManagerCollection = db.Managers.ToList<Manager>();
                    manager.StudentCollection = db.Students.ToList<Student>();

                    return View(manager);
                }
            }

            return View("ErrorFunction");
        }

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit(string id, ProjectManager usr)
        {
            string ef = "PassProjectNotification";
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
            var emailStudent = from t in db.ProjectManagers
                               join p in db.Projects on t.ProjectID equals p.ProjectID
                               join std in db.Students on t.StudentID equals std.StudentID
                               where t.ProjectManagerID == usr.ProjectManagerID
                               select std;
            var project = from t in db.ProjectManagers
                          join p in db.Projects on t.ProjectID equals p.ProjectID
                          where t.ProjectManagerID == usr.ProjectManagerID
                          select p;
            foreach (var item in project)
            {
                lstPI.Add(item.ProjectName);
            }
            foreach (var item in emailStudent)
            {
                lstEmail.Add(item.Email);
            }
            foreach (var item in emailStudent)
            {
                lstSTD.Add(item.Name);
            }
            var emailManager = from t in db.ProjectManagers
                               join p in db.Projects on t.ProjectID equals p.ProjectID
                               join mng in db.Managers on t.ManagerID equals mng.ManagerID
                               where t.ProjectManagerID == usr.ProjectManagerID
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
                var temp1 = from t in db.ProjectManagers
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
                            where usr.StudentID == std.StudentID
                            select std;

                if (count >= 1)
                {
                    temp3.FirstOrDefault().ProgressID = "PROGRESS_003";
                    db.SaveChanges();
                }
                else
                {
                    temp3.FirstOrDefault().ProgressID = "PROGRESS_002";
                    db.SaveChanges();
                }

                //Gui email thong bao
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
            if (IsHaveDeleteProjectManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<ProjectManager>(responseData);

                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        //The DELETE method
        [HttpPost]
        public async Task<ActionResult> Delete(string id, ProjectManager usr)
        {

            HttpResponseMessage responseMessage = await client.DeleteAsync(url + "/" + id);
            if (responseMessage.IsSuccessStatusCode)
            {
                //AutoUpdateProgressOnProject(usr);

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
        public bool IsEmailExist(string student)
        {
            using (InternContext dc = new InternContext())
            {
                var v = dc.ProjectManagers.Where(a => a.StudentID == student).FirstOrDefault();
                return v != null;
            }
        }
        [NonAction]
        public void SendVerificationLinkEmail(string email, string subject, string body, string emailFor = "CreateProjectNotification")
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
