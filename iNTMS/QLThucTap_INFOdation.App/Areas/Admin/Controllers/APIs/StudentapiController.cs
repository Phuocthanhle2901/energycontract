using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using QLThucTap_INFOdation.BusinessLogic.IService;
using Repository.Models;

namespace QLThucTap_INFOdation.App.Areas.Admin.Controllers.APIs
{
    public class StudentapiController : ApiController
    {
        private readonly IStudentManagementService _studentServices;
        public StudentapiController(IStudentManagementService userManagementService)
        {
            _studentServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _studentServices.GetAllStudents();
            if (users != null)
            {
                var userEntities = users as List<Student> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Students not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(string id)
        {
            var user = _studentServices.GetStudentById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public string Post([FromBody] Student userEntity)
        {
            return _studentServices.CreateStudent(userEntity);
        }

        // PUT api/user/5
        public bool Put(string id, [FromBody]Student userEntity)
        {

            return _studentServices.UpdateStudent(id, userEntity);

        }

        // DELETE api/user/5
        public bool Delete(string id)
        {

            return _studentServices.DeleteStudent(id);

        }
    }
}

