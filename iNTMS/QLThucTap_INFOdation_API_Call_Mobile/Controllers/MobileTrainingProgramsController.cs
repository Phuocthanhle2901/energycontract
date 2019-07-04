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
    public class MobileTrainingProgramsController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileTrainingPrograms
        public IQueryable<TrainingProgramDTO> GetTrainingPrograms()
        {
            var lstTrainingPrograms = from s in db.TrainingPrograms
                           select new TrainingProgramDTO()
                           {
                               TrainingProgramID = s.TrainingProgramID,
                               TrainingContent = s.TrainingContent,
                               SpecializeID = s.SpecializeID,
                               StartDate = s.StartDate,
                               EndDate = s.EndDate,
                               DateCreated = s.DateCreated,
                               LastUpdated = s.LastUpdated
                           };
            return lstTrainingPrograms;
        }

        // GET: api/MobileTrainingPrograms/5
        [ResponseType(typeof(TrainingProgramDTO))]
        public IHttpActionResult GetTrainingProgram(string id)
        {
            TrainingProgram trainingProgram = db.TrainingPrograms.Find(id);
            if (trainingProgram == null)
            {
                return NotFound();
            }

            TrainingProgramDTO temp = new TrainingProgramDTO();
            temp.TrainingProgramID = trainingProgram.TrainingProgramID;
            temp.TrainingContent = trainingProgram.TrainingContent;
            temp.SpecializeID = trainingProgram.SpecializeID;
            temp.StartDate = trainingProgram.StartDate;
            temp.EndDate = trainingProgram.EndDate;
            temp.DateCreated = trainingProgram.DateCreated;
            temp.LastUpdated = temp.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileTrainingPrograms/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTrainingProgram(string id, TrainingProgram trainingProgram)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != trainingProgram.TrainingProgramID)
            {
                return BadRequest();
            }

            db.Entry(trainingProgram).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrainingProgramExists(id))
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

        // POST: api/MobileTrainingPrograms
        [ResponseType(typeof(TrainingProgramDTO))]
        public IHttpActionResult PostTrainingProgram(TrainingProgram trainingProgram)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TrainingPrograms.Add(trainingProgram);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (TrainingProgramExists(trainingProgram.TrainingProgramID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new TrainingProgramDTO()
            {
                TrainingProgramID = trainingProgram.TrainingProgramID,
                TrainingContent = trainingProgram.TrainingContent,
                SpecializeID = trainingProgram.SpecializeID,
                StartDate = trainingProgram.StartDate,
                EndDate = trainingProgram.EndDate,
                DateCreated = trainingProgram.DateCreated,
                LastUpdated = trainingProgram.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = trainingProgram.TrainingProgramID }, dto);
        }

        // DELETE: api/MobileTrainingPrograms/5
        [ResponseType(typeof(TrainingProgram))]
        public IHttpActionResult DeleteTrainingProgram(string id)
        {
            TrainingProgram trainingProgram = db.TrainingPrograms.Find(id);
            if (trainingProgram == null)
            {
                return NotFound();
            }

            db.TrainingPrograms.Remove(trainingProgram);
            db.SaveChanges();

            TrainingProgramDTO temp = new TrainingProgramDTO();
            temp.TrainingProgramID = trainingProgram.TrainingProgramID;
            temp.TrainingContent = trainingProgram.TrainingContent;
            temp.SpecializeID = trainingProgram.SpecializeID;
            temp.StartDate = trainingProgram.StartDate;
            temp.EndDate = trainingProgram.EndDate;
            temp.DateCreated = trainingProgram.DateCreated;
            temp.LastUpdated = trainingProgram.LastUpdated;
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

        private bool TrainingProgramExists(string id)
        {
            return db.TrainingPrograms.Count(e => e.TrainingProgramID == id) > 0;
        }
    }
}