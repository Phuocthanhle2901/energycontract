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
    public class UserPermissionapiController : ApiController
    {
        private readonly IUserPermissionService _managerServices;
        public UserPermissionapiController(IUserPermissionService userManagementService)
        {
            _managerServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _managerServices.GetAllUserPermissions();
            if (users != null)
            {
                var userEntities = users as List<UserPermission> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Managers not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(int id)
        {
            var user = _managerServices.GetUserPermissionById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public int Post([FromBody] UserPermission userEntity)
        {
            return _managerServices.CreateUserPermission(userEntity);
        }

        // PUT api/user/5
        public bool Put(int id, [FromBody]UserPermission userEntity)
        {

            return _managerServices.UpdateUserPermission(id, userEntity);

        }

        // DELETE api/user/5
        public bool Delete(int id)
        {

            return _managerServices.DeleteUserPermission(id);

        }
    }
}

