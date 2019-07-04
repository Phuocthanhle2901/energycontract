using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using Repository.DAL;
using Repository.Models;
using System.Web.Security;

namespace QLThucTap_INFOdation.App.Controllers.GUIs
{
    public class ForgotPasswordController : Controller
    {
        // GET: ForgotPassword
        public ActionResult ForgotPassword()
        {
            return View();
        }
        [HttpPost]
        public ActionResult ForgotPassword(string Email)
        {
            string message = "";
            bool status = false;
            using (InternContext dc = new InternContext())
            {
                var account = dc.Logins.Where(a => a.Email == Email ).FirstOrDefault();
                if (account != null)
                {
                    string resetCode = Guid.NewGuid().ToString();
                    SendVerificationLinkEmail(account.Email, resetCode, "ResetPassword");
                    account.ResetPasswordCode = resetCode;
                    dc.Configuration.ValidateOnSaveEnabled = false;
                    dc.SaveChanges();


                }
                else
                {
                    message = "Account not found!!!";
                }
            }
            return RedirectToAction("Login", "Home");
            //return View();
        }

        public ActionResult ResetPassword(string id)
        {
            using (InternContext dc = new InternContext())
            {
                var user = dc.Logins.Where(a => a.ResetPasswordCode == id).FirstOrDefault();
                if (user != null)
                {
                    ResetPasswordModel model = new ResetPasswordModel();
                    model.ResetCode = id;
                    return View(model);
                }
                else
                {
                    return HttpNotFound();
                }
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ResetPassword(ResetPasswordModel model)
        {
            var message = "";
            if (ModelState.IsValid)
            {
                using (InternContext dc = new InternContext())
                {
                    var user = dc.Logins.Where(a => a.ResetPasswordCode == model.ResetCode).FirstOrDefault();
                    if (user != null)
                    {
                        user.Password = model.NewPassword;
                        user.ResetPasswordCode = "";
                        dc.Configuration.ValidateOnSaveEnabled = false;
                        dc.SaveChanges();
                        message = "Success!";
                    }
                }
            }
            else
            {
                message = "!!!";
            }
            ViewBag.Message = message;            
            return View(model);
        }
        [NonAction]
        public void SendVerificationLinkEmail(string email, string activationCode, string emailFor = "VerifyAccount")
        {
            var verifyUrl = "/ForgotPassword/" + emailFor + "/" + activationCode;
            var link = Request.Url.AbsoluteUri.Replace(Request.Url.PathAndQuery, verifyUrl);

            var fromEmail = new MailAddress("mariobolobala@gmail.com", "mario bolobala");
            var toEmail = new MailAddress(email);
            var fromEmailPassword = "tranhuutich1";

            string subject = "";
            string body = "";
            if (emailFor == "VerifyAccount")
            {
                subject = "Tài khoản của bạn đã được tạo. Vui lòng kích hoạt tại link kèm theo!";
                body = "<br/><br/>Chúng tôi vui lòng thông báo tài khoản của bạn" +
                    " đã được tạo thành công. Vui lòng click vào link bên dưới để xác nhận" +
                    " <br/><br/><a href='" + link + "'>" + link + "</a> ";
            }
            else if (emailFor == "ResetPassword")
            {
                subject = "Reset Password";
                body = "<br/><br/>Chúng tôi nhận được thông báo yêu cầu cấp lại mật khẩu. Vui lòng click vào đường lên bên dưới để tiến hành tạo lại mật khẩu mới." +
                    "<br/><br/><a href=" + link + ">Reset Password link</a>";
            }


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