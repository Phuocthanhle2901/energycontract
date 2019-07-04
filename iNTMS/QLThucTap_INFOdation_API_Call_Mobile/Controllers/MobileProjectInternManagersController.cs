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
    public class MobileProjectInternManagersController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileProjectInternManagers
        public IQueryable<ProjectInternManagerDTO> GetProjectInternManagers()
        {
            var lstProjectInternManagers = from s in db.ProjectInternManagers
                                           select new ProjectInternManagerDTO()
                                           {
                                               ProjectInternManagerID = s.ProjectInternManagerID,
                                               InternshipID = s.InternshipID,
                                               ManagerID = s.ManagerID,
                                               ProjectInternID = s.ProjectInternID,
                                               StudentID = s.StudentID,
                                               IsPass = s.IsPass,
                                               DateCreated = s.DateCreated,
                                               LastUpdated = s.LastUpdated
                                           };
            return lstProjectInternManagers;
        }

        // GET: api/MobileProjectInternManagers/5
        [ResponseType(typeof(ProjectInternManager))]
        public IHttpActionResult GetProjectInternManager(string id)
        {
            ProjectInternManager projectInternManager = db.ProjectInternManagers.Find(id);
            if (projectInternManager == null)
            {
                return NotFound();
            }

            ProjectInternManagerDTO temp = new ProjectInternManagerDTO();
            temp.ProjectInternManagerID = projectInternManager.ProjectInternManagerID;
            temp.ProjectInternID = projectInternManager.ProjectInternID;
            temp.InternshipID = projectInternManager.InternshipID;
            temp.ManagerID = projectInternManager.ManagerID;
            temp.StudentID = projectInternManager.StudentID;
            temp.IsPass = projectInternManager.IsPass;
            temp.DateCreated = projectInternManager.DateCreated;
            temp.LastUpdated = projectInternManager.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileProjectInternManagers/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutProjectInternManager(string id, ProjectInternManager projectInternManager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != projectInternManager.ProjectInternManagerID)
            {
                return BadRequest();
            }

            db.Entry(projectInternManager).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectInternManagerExists(id))
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

        // POST: api/MobileProjectInternManagers
        [ResponseType(typeof(ProjectInternManagerDTO))]
        public IHttpActionResult PostProjectInternManager(ProjectInternManager projectInternManager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ProjectInternManagers.Add(projectInternManager);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ProjectInternManagerExists(projectInternManager.ProjectInternManagerID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new ProjectInternManagerDTO()
            {
                ProjectInternManagerID = projectInternManager.ProjectInternManagerID,
                ProjectInternID = projectInternManager.ProjectInternID,
                InternshipID = projectInternManager.InternshipID,
                ManagerID = projectInternManager.ManagerID,
                StudentID = projectInternManager.StudentID,
                IsPass = projectInternManager.IsPass,
                DateCreated = projectInternManager.DateCreated,
                LastUpdated = projectInternManager.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = projectInternManager.ProjectInternManagerID }, dto);
        }

        // DELETE: api/MobileProjectInternManagers/5
        [ResponseType(typeof(ProjectInternManagerDTO))]
        public IHttpActionResult DeleteProjectInternManager(string id)
        {
            ProjectInternManager projectInternManager = db.ProjectInternManagers.Find(id);
            if (projectInternManager == null)
            {
                return NotFound();
            }

            db.ProjectInternManagers.Remove(projectInternManager);
            db.SaveChanges();

            ProjectInternManagerDTO temp = new ProjectInternManagerDTO();
            temp.ProjectInternManagerID = projectInternManager.ProjectInternManagerID;
            temp.ProjectInternID = projectInternManager.ProjectInternID;
            temp.InternshipID = projectInternManager.InternshipID;
            temp.ManagerID = projectInternManager.ManagerID;
            temp.StudentID = projectInternManager.StudentID;
            temp.IsPass = projectInternManager.IsPass;
            temp.DateCreated = projectInternManager.DateCreated;
            temp.LastUpdated = projectInternManager.LastUpdated;
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

        private bool ProjectInternManagerExists(string id)
        {
            return db.ProjectInternManagers.Count(e => e.ProjectInternManagerID == id) > 0;
        }
    }
}