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
using Repository.DAL;
using Repository.Models;

namespace QLThucTap_INFOdation.App.Controllers.GUIs
{
    public class StudentCVCreateController : Controller
    {
        // GET: ManagerMVC
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/studentcvapi";
        HttpClient client;
        public StudentCVCreateController()
        {
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        public ActionResult Create()
        {
            StudentCV manager = new StudentCV();
            manager.KnowUCollection = db.KnowUs.ToList<KnowU>();
            manager.ExpectedCollection = db.ExpectedLocations.ToList<ExpectedLocation>();
            manager.SpecializeCollection = db.Specializes.ToList<Specialize>();
            return View(manager);
        }

        // POST: mvcusers/Create

        [HttpPost]
        public async Task<ActionResult> Create(StudentCV usr)
        {

            bool Status = false;
            string message = "";

            var isExist = IsEmailExist(usr.Email);
            if (isExist)
            {
                ModelState.AddModelError(string.Empty, "Email already exist");
                return View(usr);
            }
            HttpResponseMessage responseMessage = await client.PostAsJsonAsync(url, usr);
            
            message = "Đã gửi CV thành công!" +
                " thông báo đã được gửi đến địa chỉ email:" + usr.Email;
            Status = true;
            if (responseMessage.IsSuccessStatusCode)
            {
                string ef = "ReceivedCV";
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
                foreach ( var subject in lstEFS)
                {
                    foreach ( var body in lstEFB1)
                    {
                        SendVerificationLinkEmail(usr.Email, subject, body, ef);
                    }
                }

                    
                ViewBag.Message = message;
                ViewBag.Status = Status;
                return View(usr);
                //return RedirectToAction("Index");
            }
            //return RedirectToAction("Error");
            ModelState.AddModelError(string.Empty, "Vui lòng điền đúng thông tin");
            return View(usr);

        }
        [NonAction]
        public void SendVerificationLinkEmail(string email, string subject, string body, string emailFor = "VerifyAccount")
        {
            var fromEmail = new MailAddress("mariobolobala@gmail.com", "mario bolobala");
            var toEmail = new MailAddress(email);
            var fromEmailPassword = "tranhuutich1";

            //string subject = "";
            //string body = "";
            //if (emailFor == "VerifyAccount")
            //{
            //    subject = "Chúng tôi đã nhận được CV của bạn!";
            //    body = "<br/><br/>Chúng tôi vui lòng thông báo CV của bạn" +
            //        " đã được chúng tôi tiếp nhận. Vui lòng đợi quá trình xử lý hoàn tất!";

            //}
            //else if (emailFor == "Accept")
            //{
            //    subject = "Accept CV";
            //    body = "<br/><br/>Chúng tôi vui lòng thông báo CV của bạn đã được chúng tôi chấp nhận. Vui lòng đến văn phòng INFOdation để phỏng vấn lúc";
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
        [NonAction]
        public bool IsEmailExist(string email)
        {
            using (InternContext dc = new InternContext())
            {
                var v = dc.StudentCVs.Where(a => a.Email == email).FirstOrDefault();
                return v != null;
            }
        }
    }
}