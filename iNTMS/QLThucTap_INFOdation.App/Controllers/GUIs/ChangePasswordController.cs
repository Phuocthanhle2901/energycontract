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

namespace QLThucTap_INFOdation.App.Controllers.GUIs
{
    public class ChangePasswordController : Controller
    {
        // GET: ManagerMVC
        private InternContext db = new InternContext();
        private readonly IUserPermissionService _userpermission;

        string url = "http://localhost:54224/api/loginapi";
        HttpClient client;
        public ChangePasswordController()
        {
            _userpermission = new UserPermissionService();
            client = new HttpClient();
            client.BaseAddress = new Uri(url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }



        // GET: mvcusers
        //public async Task<ActionResult> Index()
        public ActionResult Index(int? page, string id)
        {

            if (page == null) page = 1;
            id = Session["Username"].ToString();

            var projects = (from l in db.Logins
                            where l.Username == id
                            select l).OrderBy(x => x.Username);
            int pageSize = 3;

            int pageNumber = (page ?? 1);
            return View(projects.ToPagedList(pageNumber, pageSize));

        }

        public async Task<ActionResult> Details(string id)
        {

            HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
            if (responseMessage.IsSuccessStatusCode)
            {
                var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                var usr = JsonConvert.DeserializeObject<Login>(responseData);
                return View(usr);
            }


            return View("Error");
        }





        //GET: mvcusers/Edit/5
        //public async Task<ActionResult> Edit(string id)
        //{
        //    HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
        //    if (responseMessage.IsSuccessStatusCode)
        //    {
        //        var responseData = responseMessage.Content.ReadAsStringAsync().Result;

        //        var usr = JsonConvert.DeserializeObject<Login>(responseData);

        //        return View(usr);
        //    }


        //    return View("Error");
        //}
        public ActionResult Edit(string id)
        {
            using (InternContext dc = new InternContext())
            {
                var user = dc.Logins.Where(a => a.Username == id).FirstOrDefault();
                if (user != null)
                {
                    ChangePasswordModel model = new ChangePasswordModel();
                    model.Username = id;
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
        public ActionResult Edit(ChangePasswordModel model)
        {
            var message = "";
            if (ModelState.IsValid)
            {
                using (InternContext dc = new InternContext())
                {
                    var user = dc.Logins.Where(a => a.Username == model.Username).FirstOrDefault();
                    if (user != null)
                    {
                        user.Password = model.NewPassword;
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

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //public async Task<ActionResult> Edit(string id, Login usr)
        //{

        //    HttpResponseMessage responseMessage = await client.PutAsJsonAsync(url + "/" + id, usr);
        //    if (responseMessage.IsSuccessStatusCode)
        //    {
        //        return RedirectToAction("Index");
        //    }
        //    //return RedirectToAction("Error");
        //    ModelState.AddModelError(string.Empty, "Vui lòng điền đúng thông tin");

        //    return View(usr);
        //}



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
