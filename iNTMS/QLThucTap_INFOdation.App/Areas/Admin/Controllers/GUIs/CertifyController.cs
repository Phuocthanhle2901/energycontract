using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Repository.DAL;
using Rotativa;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.GUIs
{
    public class CertifyController : Controller
    {
        private InternContext db = new InternContext();        
        // GET: Admin/Certify
        public ActionResult Index(string id)
        {            
            var emps = db.Students.ToList().Where(e => e.ProgressID == "PROGRESS_003");
            return View(emps);
        }
        public ActionResult DetailsCertify(string id)
        {
            var emp = db.Students.Where(e => e.StudentID == id).First();
            return View(emp);
        }
        public ActionResult PrintCertify(string id)
        {
            var report = new ActionAsPdf("DetailsCertify", new { id = id });
            return report;
        }
    }
}