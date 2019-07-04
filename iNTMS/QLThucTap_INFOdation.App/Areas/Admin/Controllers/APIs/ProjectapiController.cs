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
    public class ProjectapiController : ApiController
    {
        private readonly IProjectManagementService _projectServices;
        public ProjectapiController(IProjectManagementService userManagementService)
        {
            _projectServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _projectServices.GetAllProjects();
            if (users != null)
            {
                var userEntities = users as List<Project> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Projects not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(string id)
        {
            var user = _projectServices.GetProjectById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public string Post([FromBody] Project userEntity)
        {
            return _projectServices.CreateProject(userEntity);
        }

        // PUT api/user/5
        public bool Put(string id, [FromBody]Project userEntity)
        {
            
                return _projectServices.UpdateProject(id, userEntity);
            
        }

        // DELETE api/user/5
        public bool Delete(string id)
        {
            
                return _projectServices.DeleteProject(id);
            
        }
    }
}

