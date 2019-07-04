using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
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
    public class ManagerController : Controller
    {
        // GET: ManagerMVC
        private readonly IUserPermissionService _userpermission;
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/managerapi";
        HttpClient client;
        public ManagerController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        private bool IsHaveCreateManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Create Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveUpdateManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Update Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveReadManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Read Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Manager"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveDeleteManager()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Delete Manager") || findper.Contains("Full All Access") || findper.Contains("Full On Manager"))
            {
                return true;
            }
            return false;
        }
        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index()
        {
            if (Session["UserName"] == null)
                return RedirectToAction("Login", "Home", new { area = "" });
            else
            {
                if (IsHaveReadManager())
                {
                    var lstmng = db.Managers.ToList<Manager>();
                    return View(lstmng);
                }
                else
                    //return RedirectToAction("Index", "AdminMenus");
                    return View("ErrorFunction");
            }
                 
        }

        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == Session["Username"].ToString()|| IsHaveReadManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<Manager>(responseData);
                    return View(usr);
                }
                return View("Error");
            }

            return View("ErrorFunction");
        }
        // GET: mvcusers/Create
        public ActionResult Create()
        {
            if (IsHaveCreateManager())
            {
                return View(new Manager());
            }
            else
                return View("ErrorFunction");
        }

        // POST: mvcusers/Create

        [HttpPost]
        public async Task<ActionResult> Create(Manager usr)
        {
            var isExist = IsEmailExist(usr.Email);
            if (isExist)
            {
                ModelState.AddModelError(string.Empty, "Email already exist");
                return View(usr);
            }
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
            if (id == Session["Username"].ToString() || IsHaveUpdateManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<Manager>(responseData);

                    return View(usr);
                }
                return View("Error");
            }

            return View("ErrorFunction");
        }

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit(string id, Manager usr)
        {
            
            HttpResponseMessage responseMessage = await client.PutAsJsonAsync(url + "/" + id, usr);
            if (responseMessage.IsSuccessStatusCode)
            {
                return RedirectToAction("Details"+"/"+id);
            }
            //return RedirectToAction("Error");
            ModelState.AddModelError(string.Empty, "Vui lòng điền đúng thông tin");

            return View(usr);
        }

        public async Task<ActionResult> Delete(string id)
        {
            if (IsHaveDeleteManager())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<Manager>(responseData);

                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        //The DELETE method
        [HttpPost]
        public async Task<ActionResult> Delete(string id, Manager usr)
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
        [NonAction]
        public bool IsEmailExist(string email)
        {
            using (InternContext dc = new InternContext())
            {
                var v = dc.Managers.Where(a => a.Email == email).FirstOrDefault();
                return v != null;
            }
        }
    }
}
