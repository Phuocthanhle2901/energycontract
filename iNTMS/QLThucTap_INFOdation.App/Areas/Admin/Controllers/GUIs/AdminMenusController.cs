using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.GUIs
{
    public class AdminMenusController : Controller
    {
        // GET: Admin/AdminMenus
        public ActionResult Index()
        {
            if (Session["UserName"] == null)
                return RedirectToAction("Login", "Home", new { area = "" });
            if (Session["RoleID"].ToString()=="3")
                return RedirectToAction("Index", "StudentMenus", new { area = "" });
            else
            {
                ViewBag.Title = "Admin Homepage";
                return View();
            }
                
        }
    }
}