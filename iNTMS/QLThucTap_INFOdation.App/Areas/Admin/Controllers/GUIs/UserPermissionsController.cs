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
    public class UserPermissionsController : Controller
    {
        // GET: ManagerMVC
        private readonly IUserPermissionService _userpermission;
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/userpermissionapi";
        HttpClient client;
        public UserPermissionsController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        private bool IsHaveCreateUserPermission()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Create User Permission") || findper.Contains("Full All Access") || findper.Contains("Full On User Permission"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveUpdateUserPermission()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Update User Permission") || findper.Contains("Full All Access") || findper.Contains("Full On User Permission"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveReadUserPermission()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Read User Permission") || findper.Contains("Full All Access") || findper.Contains("Full On User Permission"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveDeleteUserPermission()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Delete User Permission") || findper.Contains("Full All Access") || findper.Contains("Full On User Permission"))
            {
                return true;
            }
            return false;
        }
        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index()
        {
            if (IsHaveReadUserPermission())
            {
                var lststudents = db.UserPermissions.ToList<UserPermission>();
                return View(lststudents);
            }
            else
                return View("ErrorFunction");
        }

        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(int id)
        {
            if (IsHaveReadUserPermission())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<UserPermission>(responseData);
                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        // GET: mvcusers/Create
        public ActionResult Create()
        {
            if (IsHaveCreateUserPermission())
            {
                UserPermission manager = new UserPermission();
                manager.LoginCollection = db.Logins.ToList<Login>();
                manager.FunctionCollection = db.Functions.ToList<Function>();                
                return View(manager);
            }
            else
                return View("ErrorFunction");
        }

        // POST: mvcusers/Create

        [HttpPost]
        public async Task<ActionResult> Create(UserPermission usr)
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
        public async Task<ActionResult> Edit(int id)
        {
            if (IsHaveUpdateUserPermission())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var manager = JsonConvert.DeserializeObject<UserPermission>(responseData);
                    manager.LoginCollection = db.Logins.ToList<Login>();
                    manager.FunctionCollection = db.Functions.ToList<Function>();
                    
                    return View(manager);
                }
            }

            return View("ErrorFunction");
        }

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit(int id, UserPermission usr)
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

        public async Task<ActionResult> Delete(int id)
        {
            if (IsHaveDeleteUserPermission())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<UserPermission>(responseData);

                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        //The DELETE method
        [HttpPost]
        public async Task<ActionResult> Delete(int id, UserPermission usr)
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
