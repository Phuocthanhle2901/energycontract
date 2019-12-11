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
    public class StudentCVsController : Controller
    {
        private readonly IUserPermissionService _userpermission;
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/studentcvapi";
        HttpClient client;
        public StudentCVsController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        private bool IsHaveUpdateStudentCV()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Update StudentCV") || findper.Contains("Full All Access") || findper.Contains("Full On StudentCV"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveReadStudentCV()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Read StudentCV") || findper.Contains("Full All Access") || findper.Contains("Full On StudentCV"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveDeleteStudentCV()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Delete StudentCV") || findper.Contains("Full All Access") || findper.Contains("Full On StudentCV"))
            {
                return true;
            }
            return false;
        }
        public ActionResult Index()
        {
            if (IsHaveReadStudentCV())
            {
                var lststudentcvs = db.StudentCVs.ToList<StudentCV>();
                return View(lststudentcvs);
            }
            else
                return View("ErrorFunction");
        }
        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(int id)
        {
            if (IsHaveReadStudentCV())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<StudentCV>(responseData);
                    return View(usr);
                }
            }
           
            return View("ErrorFunction");
        }
        public async Task<ActionResult> Edit(int id)
        {
            if(IsHaveUpdateStudentCV())
            {
                //bool Status = false;
                //string message = "";            
                //StudentCV studentCV = new StudentCV();
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                //SendVerificationLinkEmail(studentCV.Email);            
                //Status = true;
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var manager = JsonConvert.DeserializeObject<StudentCV>(responseData);
                    manager.KnowUCollection = db.KnowUs.ToList<KnowU>();
                    manager.ExpectedCollection = db.ExpectedLocations.ToList<ExpectedLocation>();
                    manager.SpecializeCollection = db.Specializes.ToList<Specialize>();
                    //SendVerificationLinkEmail(manager.Email, "Accept");
                    return View(manager);
                }
            }
            
            return View("ErrorFunction");
        }

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit(int id, StudentCV usr)
        {
            string ef = "AcceptCV";
            List<string> lstEFS = new List<string>();
            List<string> lstEFB1 = new List<string>();
            var emailFor = from e in db.EmailTemplates where e.EmailFor == ef select e;
            foreach (var item in emailFor)
            {
                lstEFS.Add(item.Subject);
            }
            foreach (var item in emailFor)
            {
                lstEFB1.Add(item.Body1);
            }

            HttpResponseMessage responseMessage = await client.PutAsJsonAsync(url + "/" + id, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                if(usr.Status == "Accept")
                {
                    foreach (var subject in lstEFS)
                    {
                        foreach (var body in lstEFB1)
                        {
                            SendVerificationLinkEmail(usr.Email, subject, body + usr.InterviewSchedule.ToString(), ef);
                        }
                    }
                    
                }
                return RedirectToAction("Index");
            }
            return RedirectToAction("ErrorFunction");
        }

        public async Task<ActionResult> Delete(int id)
        {
            if (IsHaveDeleteStudentCV())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<StudentCV>(responseData);

                    return View(usr);
                }
            }
            
            return View("ErrorFunction");
        }
        //The DELETE method
        [HttpPost]
        public async Task<ActionResult> Delete(int id, StudentCV usr)
        {

            HttpResponseMessage responseMessage = await client.DeleteAsync(url + "/" + id);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("Index");
            }
            return RedirectToAction("ErrorFunction");
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
        public void SendVerificationLinkEmail(string email, string subject, string body, string emailFor = "VerifyAccount")
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
