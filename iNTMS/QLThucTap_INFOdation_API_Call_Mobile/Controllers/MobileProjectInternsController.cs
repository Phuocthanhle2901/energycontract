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
    public class MobileProjectInternsController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileProjectInterns
        public IQueryable<ProjectInternDTO> GetProjectInterns()
        {
            var lstProjectInterns = from s in db.ProjectInterns
                           select new ProjectInternDTO()
                           {
                               ProjectInternID = s.ProjectInternID,
                               ProjectInternName = s.ProjectInternName,
                               ProjectInternContent = s.ProjectInternContent,
                               StartDate = s.StartDate,
                               EndDate = s.EndDate,
                               DateCreated = s.DateCreated,
                               LastUpdated = s.LastUpdated
                           };
            return lstProjectInterns;
        }

        // GET: api/MobileProjectInterns/5
        [ResponseType(typeof(ProjectIntern))]
        public IHttpActionResult GetProjectIntern(string id)
        {
            ProjectIntern projectIntern = db.ProjectInterns.Find(id);
            if (projectIntern == null)
            {
                return NotFound();
            }

            ProjectInternDTO temp = new ProjectInternDTO();
            temp.ProjectInternID = projectIntern.ProjectInternID;
            temp.ProjectInternName = projectIntern.ProjectInternName;
            temp.ProjectInternContent = projectIntern.ProjectInternContent;
            temp.StartDate = projectIntern.StartDate;
            temp.EndDate = projectIntern.EndDate;
            temp.DateCreated = projectIntern.DateCreated;
            temp.LastUpdated = projectIntern.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileProjectInterns/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutProjectIntern(string id, ProjectIntern projectIntern)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != projectIntern.ProjectInternID)
            {
                return BadRequest();
            }

            db.Entry(projectIntern).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectInternExists(id))
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

        // POST: api/MobileProjectInterns
        [ResponseType(typeof(ProjectIntern))]
        public IHttpActionResult PostProjectIntern(ProjectIntern projectIntern)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ProjectInterns.Add(projectIntern);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ProjectInternExists(projectIntern.ProjectInternID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new ProjectInternDTO()
            {
                ProjectInternID = projectIntern.ProjectInternID,
                ProjectInternName = projectIntern.ProjectInternName,
                ProjectInternContent = projectIntern.ProjectInternContent,
                StartDate = projectIntern.StartDate,
                EndDate = projectIntern.EndDate,
                DateCreated = projectIntern.DateCreated,
                LastUpdated = projectIntern.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = projectIntern.ProjectInternID }, dto);
        }

        // DELETE: api/MobileProjectInterns/5
        [ResponseType(typeof(ProjectIntern))]
        public IHttpActionResult DeleteProjectIntern(string id)
        {
            ProjectIntern projectIntern = db.ProjectInterns.Find(id);
            if (projectIntern == null)
            {
                return NotFound();
            }

            db.ProjectInterns.Remove(projectIntern);
            db.SaveChanges();

            ProjectInternDTO temp = new ProjectInternDTO();
            temp.ProjectInternID = projectIntern.ProjectInternID;
            temp.ProjectInternName = projectIntern.ProjectInternName;
            temp.ProjectInternContent = projectIntern.ProjectInternContent;
            temp.StartDate = projectIntern.StartDate;
            temp.EndDate = projectIntern.EndDate;
            temp.DateCreated = projectIntern.DateCreated;
            temp.LastUpdated = projectIntern.LastUpdated;
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

        private bool ProjectInternExists(string id)
        {
            return db.ProjectInterns.Count(e => e.ProjectInternID == id) > 0;
        }
    }
}