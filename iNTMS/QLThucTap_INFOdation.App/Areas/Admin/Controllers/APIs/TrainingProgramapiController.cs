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
    public class TrainingProgramapiController : ApiController
    {
        private readonly ITrainingProgramManagementService _trainingProgramServices;
        public TrainingProgramapiController(ITrainingProgramManagementService userManagementService)
        {
            _trainingProgramServices = userManagementService;
        }

        // GET api/user
        public HttpResponseMessage Get()
        {
            var users = _trainingProgramServices.GetAllTrainingPrograms();
            if (users != null)
            {
                var userEntities = users as List<TrainingProgram> ?? users.ToList();
                if (userEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, userEntities);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Training Program not found");
        }

        // GET api/user/5
        public HttpResponseMessage Get(string id)
        {
            var user = _trainingProgramServices.GetTrainingProgramById(id);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, user);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No user found for this id");
        }

        // POST api/user
        public string Post([FromBody] TrainingProgram userEntity)
        {
            return _trainingProgramServices.CreateTrainingProgram(userEntity);
        }

        // PUT api/user/5
        public bool Put(string id, [FromBody]TrainingProgram userEntity)
        {

            return _trainingProgramServices.UpdateTrainingProgram(id, userEntity);

        }

        // DELETE api/user/5
        public bool Delete(string id)
        {

            return _trainingProgramServices.DeleteTrainingProgram(id);

        }
    }
}

