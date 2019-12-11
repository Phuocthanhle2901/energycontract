using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QLThucTap_INFOdation.App.Controllers.GUIs
{
    public class StudentMenusController : Controller
    {
        // GET: Admin/AdminMenus
        public ActionResult Index()
        {
            if (Session["UserName"] == null)
                return RedirectToAction("Login", "Home", new { area = "" });
            if (Session["RoleID"].ToString() == "1" || Session["RoleID"].ToString() == "2")
                return RedirectToAction("Index", "AdminMenus", new { area = "Admin" });
            else
            {
                ViewBag.Title = "Student Homepage";
                return View();
            }
        }
    }
}