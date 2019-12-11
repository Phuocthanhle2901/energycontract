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
using QLThucTap_INFOdation.BusinessLogic.IService;
using QLThucTap_INFOdation.BusinessLogic.Service;
using Repository.DAL;
using Repository.Models;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.GUIs
{
    public class ProjectInternsController : Controller
    {
        // GET: ManagerMVC
        private readonly IUserPermissionService _userpermission;
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/projectinternapi";
        HttpClient client;
        public ProjectInternsController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        private bool IsHaveCreateProjectIntern()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Create Project Intern") || findper.Contains("Full All Access") || findper.Contains("Full On Project Intern"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveUpdateProjectIntern()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Update Project Intern") || findper.Contains("Full All Access") || findper.Contains("Full On Project Intern"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveReadProjectIntern()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Read Project Intern") || findper.Contains("Full All Access") || findper.Contains("Full On Project Intern"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveDeleteProjectIntern()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Delete Project Intern") || findper.Contains("Full All Access") || findper.Contains("Full On Project Intern"))
            {
                return true;
            }
            return false;
        }

        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index()
        {
            if (IsHaveReadProjectIntern())
            {
                var lstprojectinterns = db.ProjectInterns.ToList<ProjectIntern>();
                return View(lstprojectinterns);
            }
            else
                return View("ErrorFunction");
            
            
        }

        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (IsHaveReadProjectIntern())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<ProjectIntern>(responseData);
                    return View(usr);
                }
            
            }
            return View("ErrorFunction");
        }
        // GET: mvcusers/Create
        public ActionResult Create()
        {
            if (IsHaveCreateProjectIntern())
            {
                return View(new ProjectIntern());
            }
            else
                return View("ErrorFunction");
            
        }

        // POST: mvcusers/Create

        [HttpPost]
        public async Task<ActionResult> Create(ProjectIntern usr)
        {

            HttpResponseMessage responseMessage = await client.PostAsJsonAsync(url, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("Index");
            }
            //return RedirectToAction("Error");
            ModelState.AddModelError(string.Empty, "Vui lòng điền đúng thông tin");

            return View(usr);
        }


        // GET: mvcusers/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (IsHaveUpdateProjectIntern())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<ProjectIntern>(responseData);

                    return View(usr);
                }
            }
            
            return View("ErrorFunction");
        }

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit(string id, ProjectIntern usr)
        {

            HttpResponseMessage responseMessage = await client.PutAsJsonAsync(url + "/" + id, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("Index");
            }
            //return RedirectToAction("Error");
            ModelState.AddModelError(string.Empty, "Vui lòng điền đúng thông tin");

            return View(usr);
        }

        public async Task<ActionResult> Delete(string id)
        {
            if (IsHaveDeleteProjectIntern())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<ProjectIntern>(responseData);

                    return View(usr);
                }
            }
            
            return View("ErrorFunction");
        }
        //The DELETE method
        [HttpPost]
        public async Task<ActionResult> Delete(string id, ProjectIntern usr)
        {

            HttpResponseMessage responseMessage = await client.DeleteAsync(url + "/" + id);
            if (responseMessage.IsSuccessStatusCode)
            {
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
    }
}
