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
    public class LoginapiController : ApiController
    {
        private readonly ILoginManagementService _managerServices;
        public LoginapiController(ILoginManagementService userManagementService)
        {
            _managerServices = userManagementService;
        }

        public HttpResponseMessage Get()
        {
            var users = _managerServices.GetAllLogins();
            if (users != null)
            {
                var userEntities = users as List<Login> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Students not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(string id)
        {
            var user = _managerServices.GetLoginById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public string Post([FromBody] Login userEntity)
        {
            return _managerServices.CreateLogin(userEntity);
        }

        // PUT api/user/5
        public bool Put(string id, [FromBody]Login userEntity)
        {

            return _managerServices.UpdateLogin(id, userEntity);

        }

        // DELETE api/user/5
        public bool Delete(string id)
        {

            return _managerServices.DeleteLogin(id);

        }
    }
}



