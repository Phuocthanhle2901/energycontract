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
    public class StudentManagerForStudentsController : Controller
    {
        // GET: ManagerMVC
        private InternContext db = new InternContext();
        private readonly IUserPermissionService _userpermission;

        string url = "http://localhost:54224/api/studentapi";
        HttpClient client;
        public StudentManagerForStudentsController()
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

            var projects = (from l in db.Students
                            where l.StudentID == id
                            select l).OrderBy(x => x.StudentID);
            var strStudentProgress = Convert.ToInt32(projects.FirstOrDefault().ProgressID.Substring(9));

            int count = 0;
            var progress = from p in db.Progresses
                           select p;
            foreach (var item in progress)
            {
                count++;
            }
            float percent = (float)strStudentProgress / (count - 1) * 100;


            ViewData["Message"] = percent + "%";
            int pageSize = 3;

            int pageNumber = (page ?? 1);
            return View(projects.ToPagedList(pageNumber, pageSize));
            //________________________________
            //HttpResponseMessage responseMessage = await client.GetAsync(url);
            //if (responseMessage.IsSuccessStatusCode)
            //{
            //    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

            //    var usrs = JsonConvert.DeserializeObject<List<Project>>(responseData);

            //    return View(usrs);
            //}
            //return View("Error");
        }

        // GET: mvcusers/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == Session["Username"].ToString())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;
                    var usr = JsonConvert.DeserializeObject<Student>(responseData);
                    return View(usr);
                }
                return View("Error");
            }
            return View("Error");
        }


        // GET: mvcusers/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (id == Session["Username"].ToString())
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url + "/" + id);
                if (responseMessage.IsSuccessStatusCode)
                {
                    var responseData = responseMessage.Content.ReadAsStringAsync().Result;

                    var usr = JsonConvert.DeserializeObject<Student>(responseData);

                    return View(usr);
                }


                return View("Error");
            }
            return View("Error");
        }

        // POST: mvcusers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<ActionResult> Edit(string id, Student usr)
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
