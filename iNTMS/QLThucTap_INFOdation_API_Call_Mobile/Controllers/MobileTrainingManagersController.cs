using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Repository.DAL;
using Repository.Models;

namespace QLThucTap_INFOdation_API_Call_Mobile.Controllers
{
    public class MobileTrainingManagersController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileTrainingManagers
        public IQueryable<TrainingManagerDTO> GetTrainingManagers()
        {
            var lstTrainingManager = from s in db.TrainingManagers
                           select new TrainingManagerDTO()
                           {
                               TrainingManagerID = s.TrainingManagerID,
                               InternshipID = s.InternshipID,
                               ManagerID = s.ManagerID,
                               StudentID = s.StudentID,
                               StageID = s.StageID,
                               TrainingProgramID = s.TrainingProgramID,
                               AssertmentContent = s.AssertmentContent,
                               IsPass = s.IsPass,
                               DateCreated = s.DateCreated,
                               LastUpdated = s.LastUpdated
                           };
            return lstTrainingManager;
        }

        // GET: api/MobileTrainingManagers/5
        [ResponseType(typeof(TrainingManagerDTO))]
        public IHttpActionResult GetTrainingManager(string id)
        {
            TrainingManager trainingManager = db.TrainingManagers.Find(id);
            if (trainingManager == null)
            {
                return NotFound();
            }

            TrainingManagerDTO temp = new TrainingManagerDTO();
            temp.TrainingManagerID = trainingManager.TrainingManagerID;
            temp.InternshipID = trainingManager.InternshipID;
            temp.ManagerID = trainingManager.ManagerID;
            temp.StudentID = trainingManager.StudentID;
            temp.StageID = trainingManager.StageID;
            temp.TrainingProgramID = trainingManager.TrainingProgramID;
            temp.AssertmentContent = trainingManager.AssertmentContent;
            temp.IsPass = trainingManager.IsPass;
            temp.DateCreated = trainingManager.DateCreated;
            temp.LastUpdated = trainingManager.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileTrainingManagers/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTrainingManager(string id, TrainingManager trainingManager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != trainingManager.TrainingManagerID)
            {
                return BadRequest();
            }

            db.Entry(trainingManager).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrainingManagerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/MobileTrainingManagers
        [ResponseType(typeof(TrainingManagerDTO))]
        public IHttpActionResult PostTrainingManager(TrainingManager trainingManager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TrainingManagers.Add(trainingManager);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (TrainingManagerExists(trainingManager.TrainingManagerID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new TrainingManagerDTO()
            {
                TrainingManagerID = trainingManager.TrainingManagerID,
                InternshipID = trainingManager.InternshipID,
                ManagerID = trainingManager.ManagerID,
                StudentID = trainingManager.StudentID,
                StageID = trainingManager.StageID,
                TrainingProgramID = trainingManager.TrainingProgramID,
                AssertmentContent = trainingManager.AssertmentContent,
                IsPass = trainingManager.IsPass,
                DateCreated = trainingManager.DateCreated,
                LastUpdated = trainingManager.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = trainingManager.TrainingManagerID }, dto);
        }

        // DELETE: api/MobileTrainingManagers/5
        [ResponseType(typeof(TrainingManager))]
        public IHttpActionResult DeleteTrainingManager(string id)
        {
            TrainingManager trainingManager = db.TrainingManagers.Find(id);
            if (trainingManager == null)
            {
                return NotFound();
            }

            db.TrainingManagers.Remove(trainingManager);
            db.SaveChanges();

            TrainingManagerDTO temp = new TrainingManagerDTO();
            temp.TrainingManagerID = trainingManager.TrainingManagerID;
            temp.InternshipID = trainingManager.InternshipID;
            temp.ManagerID = trainingManager.ManagerID;
            temp.StudentID = trainingManager.StudentID;
            temp.StageID = trainingManager.StageID;
            temp.TrainingProgramID = trainingManager.TrainingProgramID;
            temp.AssertmentContent = trainingManager.AssertmentContent;
            temp.IsPass = trainingManager.IsPass;
            temp.DateCreated = trainingManager.DateCreated;
            temp.LastUpdated = trainingManager.LastUpdated;
            return Ok(temp);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TrainingManagerExists(string id)
        {
            return db.TrainingManagers.Count(e => e.TrainingManagerID == id) > 0;
        }
    }
}