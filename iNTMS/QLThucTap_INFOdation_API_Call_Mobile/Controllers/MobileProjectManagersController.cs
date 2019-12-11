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
    public class MobileProjectManagersController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileProjectManagers
        public IQueryable<ProjectManagerDTO> GetProjectManagers()
        {
            var lstProjectManager = from s in db.ProjectManagers
                           select new ProjectManagerDTO()
                           {
                               ProjectManagerID = s.ProjectManagerID,
                               ManagerID = s.ManagerID,
                               ProjectID = s.ProjectID,
                               StudentID = s.StudentID,
                               IsPass = s.IsPass,
                               DateCreated = s.DateCreated,
                               LastUpdated = s.LastUpdated
                           };
            return lstProjectManager;
        }

        // GET: api/MobileProjectManagers/5
        [ResponseType(typeof(ProjectManager))]
        public IHttpActionResult GetProjectManager(string id)
        {
            ProjectManager projectManager = db.ProjectManagers.Find(id);
            if (projectManager == null)
            {
                return NotFound();
            }

            ProjectManagerDTO temp = new ProjectManagerDTO();
            temp.ProjectManagerID = projectManager.ProjectManagerID;
            temp.ProjectID = projectManager.ProjectID;
            temp.ManagerID = projectManager.ManagerID;
            temp.StudentID = projectManager.StudentID;
            temp.IsPass = projectManager.IsPass;
            temp.DateCreated = projectManager.DateCreated;
            temp.LastUpdated = projectManager.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileProjectManagers/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutProjectManager(string id, ProjectManager projectManager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != projectManager.ProjectManagerID)
            {
                return BadRequest();
            }

            db.Entry(projectManager).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectManagerExists(id))
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

        // POST: api/MobileProjectManagers
        [ResponseType(typeof(ProjectManagerDTO))]
        public IHttpActionResult PostProjectManager(ProjectManager projectManager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ProjectManagers.Add(projectManager);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ProjectManagerExists(projectManager.ProjectManagerID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new ProjectManagerDTO()
            {
                ProjectManagerID = projectManager.ProjectManagerID,
                ProjectID = projectManager.ProjectID,
                ManagerID = projectManager.ManagerID,
                StudentID = projectManager.StudentID,
                IsPass = projectManager.IsPass,
                DateCreated = projectManager.DateCreated,
                LastUpdated = projectManager.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = projectManager.ProjectManagerID }, dto);
        }

        // DELETE: api/MobileProjectManagers/5
        [ResponseType(typeof(ProjectManager))]
        public IHttpActionResult DeleteProjectManager(string id)
        {
            ProjectManager projectManager = db.ProjectManagers.Find(id);
            if (projectManager == null)
            {
                return NotFound();
            }

            db.ProjectManagers.Remove(projectManager);
            db.SaveChanges();

            ProjectManagerDTO temp = new ProjectManagerDTO();
            temp.ProjectManagerID = projectManager.ProjectManagerID;
            temp.ProjectID = projectManager.ProjectID;
            temp.ManagerID = projectManager.ManagerID;
            temp.StudentID = projectManager.StudentID;
            temp.IsPass = projectManager.IsPass;
            temp.DateCreated = projectManager.DateCreated;
            temp.LastUpdated = projectManager.LastUpdated;
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

        private bool ProjectManagerExists(string id)
        {
            return db.ProjectManagers.Count(e => e.ProjectManagerID == id) > 0;
        }
    }
}