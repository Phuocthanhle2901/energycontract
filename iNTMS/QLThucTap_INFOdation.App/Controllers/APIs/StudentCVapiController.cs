using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using QLThucTap_INFOdation.BusinessLogic.IService;
using Repository.Models;

namespace QLThucTap_INFOdation.App.Controllers.APIs
{
    public class StudentCVapiController : ApiController
    {
        private readonly IStudentCVManagementService _userServices;
        public StudentCVapiController(IStudentCVManagementService userManagementService)
        {
            _userServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _userServices.GetAllStudents();
            if (users != null)
            {
                var userEntities = users as List<StudentCV> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Users not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(int id)
        {
            var user = _userServices.GetStudentById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public int Post([FromBody] StudentCV userEntity)
        {
            return _userServices.CreateStudent(userEntity);
        }

        // PUT api/user/5
        public bool Put(int id, [FromBody]StudentCV userEntity)
        {
            if (id > 0)
            {
                return _userServices.UpdateStudent(id, userEntity);
            }
            return false;
        }

        // DELETE api/user/5
        public bool Delete(int id)
        {
            if (id > 0)
                return _userServices.DeleteStudent(id);
            return false;
        }
    }
}
