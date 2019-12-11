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
    public class ManagerapiController : ApiController
    {
        private readonly IManagerManagementService _managerServices;
        public ManagerapiController(IManagerManagementService userManagementService)
        {
            _managerServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _managerServices.GetAllManagers();
            if (users != null)
            {
                var userEntities = users as List<Manager> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Managers not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(string id)
        {
            var user = _managerServices.GetManagerById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public string Post([FromBody] Manager userEntity)
        {
            return _managerServices.CreateManager(userEntity);
        }

        // PUT api/user/5
        public bool Put(string id, [FromBody]Manager userEntity)
        {

            return _managerServices.UpdateManager(id, userEntity);

        }

        // DELETE api/user/5
        public bool Delete(string id)
        {

            return _managerServices.DeleteManager(id);

        }
    }
}

