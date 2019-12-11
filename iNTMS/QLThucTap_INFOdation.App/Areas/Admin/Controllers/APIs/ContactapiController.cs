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
    public class ContactapiController : ApiController
    {
        private readonly IContactManagementService _managerServices;
        public ContactapiController(IContactManagementService userManagementService)
        {
            _managerServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _managerServices.GetAllFunctions();
            if (users != null)
            {
                var userEntities = users as List<Contact> ?? users.ToList();
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

        

        // DELETE api/user/5
        public bool Delete(int id)
        {

            return _managerServices.DeleteFunction(id);

        }
    }
}

