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
    public class FunctionController : Controller
    {
        // GET: ManagerMVC
        private readonly IUserPermissionService _userpermission;
        private InternContext db = new InternContext();
        string url = "http://localhost:54224/api/functionapi";        
        HttpClient client;
        public FunctionController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        private bool IsHaveCreateFunction()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Create Function") || findper.Contains("Full All Access") || findper.Contains("Full On Function"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveUpdateFunction()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Update Function") || findper.Contains("Full All Access") || findper.Contains("Full On Function"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveReadFunction()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Read Function") || findper.Contains("Full All Access") || findper.Contains("Full On Function"))
            {
                return true;
            }
            return false;
        }
        private bool IsHaveDeleteFunction()
        {
            var findper = _userpermission.GetUserPermissionByUsername(Session["Username"].ToString());
            if (findper.Contains("Delete Function") || findper.Contains("Full All Access") || findper.Contains("Full On Function"))
            {
                return true;
            }
            return false;
        }
        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index()
        {
            if (IsHaveReadFunction())
            {
                var lstmng = db.Functions.ToList<Function>();
                return View(lstmng);
            }
            else
                return View("ErrorFunction");
        }

        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(int id)
        {
            if (IsHaveReadFunction())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<Function>(responseData);
                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        // GET: mvcusers/Create
        public ActionResult Create()
        {
            if (IsHaveCreateFunction())
            {
                return View(new Function());
            }
            else
                return View("ErrorFunction");
        }

        // POST: mvcusers/Create

        [HttpPost]
        public async Task<ActionResult> Create(Function usr)
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
            if (IsHaveUpdateFunction())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<Function>(responseData);

                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit(int id, Function usr)
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
            if (IsHaveDeleteFunction())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<Function>(responseData);

                    return View(usr);
                }
            }

            return View("ErrorFunction");
        }
        //The DELETE method
        [HttpPost]
        public async Task<ActionResult> Delete(int id, Function usr)
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
