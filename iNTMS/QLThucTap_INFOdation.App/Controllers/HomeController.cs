using Repository.DAL;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLThucTap_INFOdation.BusinessLogic.IService;
using QLThucTap_INFOdation.BusinessLogic.Service;
using Repository.UnitOfWork;
using System.Threading.Tasks;
using System.Text;
using System.Net.Mail;
using System.Net;

namespace QLThucTap_INFOdation.App.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        InternContext db;
        public HomeController()
        {
            db = new InternContext();
        }
        public ActionResult Index()
        {
            return View();
        }
        
        //public ActionResult HomePage()
        //{
        //    return View();
        //}

        //public ActionResult Contact()
        //{
        //    return View();
        //}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index([Bind(Include = "id,Name,Email,Phone,Message")] Contact contact)
        {
            if (ModelState.IsValid)
            {
                db.Contacts.Add(contact);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(contact);
        }
        public ActionResult Login()
        {
            if (Session["UserName"] == null)
            {
                ViewBag.Title = "Login Page";

                return View();
            }
            if (Session["RoleID"].ToString() == "2" || Session["RoleID"].ToString() == "4")
            {
                return RedirectToAction("Index", "AdminMenus", new { area = "Admin" });
            }
            if (Session["RoleID"].ToString() == "3")
            {
                return RedirectToAction("Index", "StudentMenus", new { area = "" });
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(Login objLogin)
        {
            if (ModelState.IsValid)
            {
                using (InternContext db = new InternContext())
                {
                    var obj = db.Logins.Where(a => a.Username.Equals(objLogin.Username) && a.Password.Equals(objLogin.Password)).FirstOrDefault();
                    if (obj != null)
                    {
                        Session["RoleID"] = obj.RoleID.ToString();
                        var obj1 = db.Roles.Where(a => a.RoleID.Equals(obj.RoleID)).FirstOrDefault();
                        if (obj1.RoleName.Equals("Manager") || obj1.RoleName.Equals("Admin"))
                        {
                            Session["UserName"] = obj.Username.ToString();
                            return RedirectToAction("Index", "AdminMenus", new { area = "Admin" });
                        }
                        else if (obj1.RoleName.Equals("Student"))
                        {
                            Session["UserName"] = obj.Username.ToString();
                            return RedirectToAction("Index", "StudentMenus", new { area = "" });
                        }
                    }
                }
            }
            return View("ErrorLogin");
        }
        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToAction("Index", "Home");
        }
       
    }
}