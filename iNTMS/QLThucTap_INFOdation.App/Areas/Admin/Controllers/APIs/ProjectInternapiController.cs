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
    public class ProjectInternapiController : ApiController
    {
        private readonly IProjectInternManagementService _managerServices;
        public ProjectInternapiController(IProjectInternManagementService userManagementService)
        {
            _managerServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _managerServices.GetAllProjects();
            if (users != null)
            {
                var userEntities = users as List<ProjectIntern> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Managers not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(string id)
        {
            var user = _managerServices.GetProjectById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public string Post([FromBody] ProjectIntern userEntity)
        {
            return _managerServices.CreateProject(userEntity);
        }

        // PUT api/user/5
        public bool Put(string id, [FromBody]ProjectIntern userEntity)
        {

            return _managerServices.UpdateProject(id, userEntity);

        }

        // DELETE api/user/5
        public bool Delete(string id)
        {

            return _managerServices.DeleteProject(id);

        }
    }
}

