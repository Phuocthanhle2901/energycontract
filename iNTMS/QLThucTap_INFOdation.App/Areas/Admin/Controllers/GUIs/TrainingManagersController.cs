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
using System.Web.Security;
using Newtonsoft.Json;
using PagedList;
using QLThucTap_INFOdation.BusinessLogic.IService;
using QLThucTap_INFOdation.BusinessLogic.Service;
using Repository.DAL;
using Repository.Models;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.GUIs
{
    public class TrainingManagerController : Controller
    {
        // GET: ManagerMVC
        private readonly IUserPermissionService _userpermission;
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/trainingmanagerapi";
        HttpClient client;
        public TrainingManagerController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        private bool IsHaveCreateTrainingManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Create Training Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Training Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveUpdateTrainingManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Update Training Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Training Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveReadTrainingManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Read Training Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Training Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveDeleteTrainingManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Delete Training Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Training Manager"))
            {
                return true;
            }
            return false;
        }
        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index()
        {
            if (IsHaveReadTrainingManager())
            {
                var lsttrainingmanager = db.TrainingManagers.ToList<TrainingManager>();
                return View(lsttrainingmanager);
            }
            else
                return View("ErrorFunction");
            //________________________________
            //HttpResponseMessage responseMessage = await client.GetAsync(url);
            //if (responseMessage.IsSuccessStatusCode)
            //{
            //    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

            //    var usrs = JsonConvert.DeserializeObject<List<Project>>(responseData);

            //    return View(usrs);
            //}
            //return View("Error");
        }

        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (IsHaveReadTrainingManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<TrainingManager>(responseData);
                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        // GET: mvcusers/Create
        public ActionResult Create()
        {
            if (IsHaveCreateTrainingManager())
            {
                TrainingManager manager = new TrainingManager();
                manager.TrainingProgramCollection = db.TrainingPrograms.ToList<TrainingProgram>();
                manager.ManagerCollection = db.Managers.ToList<Manager>();
                List<Student> lststudent = new List<Student>();

                var query = from t in db.TrainingManagers
                            join p in db.TrainingPrograms on t.TrainingProgramID equals p.TrainingProgramID
                            join s in db.Students on t.StudentID equals s.StudentID
                            select s;

                var query1 = from t in db.TrainingManagers
                             join p in db.TrainingPrograms on t.TrainingProgramID equals p.TrainingProgramID
                             join s in db.Students on t.StudentID equals s.StudentID
                             where !t.IsPass
                             select s;

                var query2 = (from s in db.Students select s).Except(query);

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
                //manager.StudentCollection = db.Students.ToList<Student>();
                manager.StageCollection = db.Stages.ToList<Stage>();
                manager.InternshipCollection = db.Internships.ToList<Internship>();
                return View(manager);
            }
            else
                return View("ErrorFunction");
        }

        // POST: mvcusers/Create

        [HttpPost]
        public async Task<ActionResult> Create(TrainingManager usr)
        {
            string std = Request.Form["StudentID"].ToString();
            string mng = Request.Form["ManagerID"].ToString();
            string tp = Request.Form["TrainingProgramID"].ToString();
            string ef = "CreateTrainingProgramNotification";
            List<string> lstEmail = new List<string>();
            List<string> lstSTD = new List<string>();
            List<string> lstMNG = new List<string>();
            List<string> lstTP = new List<string>();
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
            var trainingProgram = from t in db.TrainingPrograms where t.TrainingProgramID == tp select t;
            foreach (var item in trainingProgram)
            {
                lstTP.Add(item.TrainingContent);
            }
            HttpResponseMessage responseMessage = await client.PostAsJsonAsync(url, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                //Gui mail
                foreach (var Email in lstEmail)
                {
                    foreach (var tpp in lstTP)
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
                                                    SendVerificationLinkEmail(Email, subject, body1 + tpp + body2 + stdd + body3 + mngg + body4 + DateTime.Now.ToString(), tpp, mngg, stdd, ef);
                                                    foreach (var Emaill in db.SuperManagers.Select(e => e.Email).ToList())
                                                    {
                                                        SendVerificationLinkEmail(Emaill, subject, body1 + tpp + body2 + stdd + body3 + mngg + body4 + DateTime.Now.ToString(), tpp, mngg, stdd, ef);
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
            if (IsHaveUpdateTrainingManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var manager = JsonConvert.DeserializeObject<TrainingManager>(responseData);
                    manager.TrainingProgramCollection = db.TrainingPrograms.ToList<TrainingProgram>();
                    manager.ManagerCollection = db.Managers.ToList<Manager>();
                    manager.StudentCollection = db.Students.ToList<Student>();
                    manager.StageCollection = db.Stages.ToList<Stage>();
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
        public async Task<ActionResult> Edit(string id, TrainingManager usr)
        {
            string ef = "PassTrainingProgramNotification";
            List<string> lstEmail = new List<string>();
            List<string> lstSTD = new List<string>();
            List<string> lstMNG = new List<string>();
            List<string> lstTP = new List<string>();
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
            var emailStudent = from t in db.TrainingManagers
                               join p in db.TrainingPrograms on t.TrainingProgramID equals p.TrainingProgramID
                               join std in db.Students on t.StudentID equals std.StudentID
                               where t.TrainingManagerID == usr.TrainingManagerID
                               select std;
            var trainingProgram = from t in db.TrainingManagers
                                  join p in db.TrainingPrograms on t.TrainingProgramID equals p.TrainingProgramID
                                  where t.TrainingManagerID == usr.TrainingManagerID
                                  select p;
            foreach (var item in trainingProgram)
            {
                lstTP.Add(item.TrainingContent);
            }
            foreach (var item in emailStudent)
            {
                lstEmail.Add(item.Email);
            }
            foreach (var item in emailStudent)
            {
                lstSTD.Add(item.Name);
            }
            var emailManager = from t in db.TrainingManagers
                               join p in db.TrainingPrograms on t.TrainingProgramID equals p.TrainingProgramID
                               join mng in db.Managers on t.ManagerID equals mng.ManagerID
                               where t.TrainingManagerID == usr.TrainingManagerID
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
                //Update Progress
                //Auto update status IsPassTraining
                var temp1 = from t in db.TrainingManagers
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
                var temp2 = from t in db.TrainingManagers
                            join p in db.TrainingPrograms on t.TrainingProgramID equals p.TrainingProgramID
                            join s in db.Specializes on p.SpecializeID equals s.SpecializeID
                            where t.TrainingManagerID == usr.TrainingManagerID
                            select s.MinimumToPass;

                var temp3 = from std in db.Students
                            where usr.StudentID == std.StudentID
                            select std;

                if (count >= temp2.FirstOrDefault())
                {
                    temp3.FirstOrDefault().ProgressID = "PROGRESS_001";
                    db.SaveChanges();
                }
                else
                {
                    temp3.FirstOrDefault().ProgressID = "PROGRESS_000";
                    db.SaveChanges();
                }

                //Neu pass thi gui mail thong bao
                if (usr.IsPass == true)
                {
                    foreach (var Email in lstEmail)
                    {
                        foreach (var pi in lstTP)
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
                                                        SendVerificationLinkEmail(Email, subject, body1 + pi + body2 + std + body3 + mng + body4 + DateTime.Now.ToString(), pi, mng, std, ef);
                                                        foreach (var Emaill in db.SuperManagers.Select(e => e.Email).ToList())
                                                        {
                                                            SendVerificationLinkEmail(Emaill, subject, body1 + pi + body2 + std + body3 + mng + body4 + DateTime.Now.ToString(), pi, mng, std, ef);
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
            if (IsHaveDeleteTrainingManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<TrainingManager>(responseData);

                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        //The DELETE method
        [HttpPost]
        public async Task<ActionResult> Delete(string id, TrainingManager usr)
        {

            HttpResponseMessage responseMessage = await client.DeleteAsync(url + "/" + id);
            if (responseMessage.IsSuccessStatusCode)
            {
                //AutoUpdateProgressOnTraining(usr);
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
        public void SendVerificationLinkEmail(string email, string subject, string body, string PIN, string MN, string SN, string emailFor = "CreateProjectInternNotification")
        //public void SendVerificationLinkEmail(string email, string subject, string body, string emailFor = "CreateProjectInternNotification")
        {

            var fromEmail = new MailAddress("mariobolobala@gmail.com", "mario bolobala");
            var toEmail = new MailAddress(email);
            var fromEmailPassword = "tranhuutich1";

            //string subject = "";
            //string body = "";

            //if (emailFor == "CreateTrainingProgramNotification")
            //{

            //    subject = "Create Training Program Notification!!!";
            //    body = "<br/><br/> Xin thông báo! Một Training Program tên " + PIN + " vừa được tạo <br/>" + "cho sinh viên:<br/>" + SN + "<br/>quản lý bởi:<br/>" + MN + "<br/>vào lúc:" + DateTime.Now.ToString();
            //}
            //if (emailFor == "TrainingProgramPassNotification")
            //{
            //    subject = "Training Program Pass Notification!!!";

            //    body = "<br/><br/> Xin thông báo! Một Training Program tên " + PIN + " vừa hoàn thành <br/>" + "bởi sinh viên:<br/>" + SN + "<br/>quản lý bởi:<br/>" + MN + "<br/>vào lúc:" + DateTime.Now.ToString();
            //    //body = "<br/><br/> Xin thông báo! Một Project Intern Manager vừa được hoàn thành vào lúc: <br/>" + DateTime.Now.ToString();

            //}
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
