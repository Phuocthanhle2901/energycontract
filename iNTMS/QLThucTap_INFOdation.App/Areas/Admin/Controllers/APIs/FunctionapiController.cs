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
    public class FunctionapiController : ApiController
    {
        private readonly IFunctionManagementService _managerServices;
        public FunctionapiController(IFunctionManagementService userManagementService)
        {
            _managerServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _managerServices.GetAllFunctions();
            if (users != null)
            {
                var userEntities = users as List<Function> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Managers not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(int id)
        {
            var user = _managerServices.GetFunctionById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public int Post([FromBody] Function userEntity)
        {
            return _managerServices.CreateFunction(userEntity);
        }

        // PUT api/user/5
        public bool Put(int id, [FromBody]Function userEntity)
        {

            return _managerServices.UpdateFunction(id, userEntity);

        }

        // DELETE api/user/5
        public bool Delete(int id)
        {

            return _managerServices.DeleteFunction(id);

        }
    }
}

