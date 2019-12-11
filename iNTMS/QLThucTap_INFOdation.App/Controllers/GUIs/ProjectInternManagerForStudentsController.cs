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

namespace QLThucTap_INFOdation.App.Controllers.GUIs
{
    public class ProjectInternManagerForStudentsController : Controller
    {
        // GET: ManagerMVC
        private readonly IUserPermissionService _userpermission;
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/projectinternmanagerapi";
        HttpClient client;
        public ProjectInternManagerForStudentsController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }



        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index(string id)
        {
            if (Session["UserName"] == null)
                return RedirectToAction("Login", "Home", new { area = "" });
            else
            {
                id = Session["Username"].ToString();
                //var lstmng = db.TrainingManagers.ToList<TrainingManager>();
                var projects = (from l in db.ProjectInternManagers
                                where l.StudentID == id
                                select l).OrderBy(x => x.ProjectInternManagerID);
                return View(projects);

            }

        }

        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(string id)
        {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<ProjectInternManager>(responseData);
                    return View(usr);
                }        

            return View("Error");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
