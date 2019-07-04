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
    public class ProjectInternManagerapiController : ApiController
    {
        private readonly IProjectInternManagerManagementService _projectmanagerServices;
        public ProjectInternManagerapiController(IProjectInternManagerManagementService userManagementService)
        {
            _projectmanagerServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _projectmanagerServices.GetAllProjects();
            if (users != null)
            {
                var userEntities = users as List<ProjectInternManager> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Projects not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(string id)
        {
            var user = _projectmanagerServices.GetProjectById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public string Post([FromBody] ProjectInternManager userEntity)
        {
            return _projectmanagerServices.CreateProject(userEntity);
        }

        // PUT api/user/5
        public bool Put(string id, [FromBody]ProjectInternManager userEntity)
        {

            return _projectmanagerServices.UpdateProject(id, userEntity);

        }

        // DELETE api/user/5
        public bool Delete(string id)
        {

            return _projectmanagerServices.DeleteProject(id);

        }
    }
}

