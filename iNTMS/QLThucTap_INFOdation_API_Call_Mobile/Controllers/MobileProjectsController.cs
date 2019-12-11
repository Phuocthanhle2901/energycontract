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
    public class MobileProjectsController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileProjects
        public IQueryable<ProjectDTO> GetProjects()
        {
            var lstProject = from s in db.Projects
                           select new ProjectDTO()
                           {
                               ProjectID = s.ProjectID,
                               ProjectName = s.ProjectName,
                               ProjectContent = s.ProjectContent,
                               DateCreated = s.DateCreated,
                               LastUpdated = s.LastUpdated
                           };
            return lstProject;
        }

        // GET: api/MobileProjects/5
        [ResponseType(typeof(Project))]
        public IHttpActionResult GetProject(string id)
        {
            Project project = db.Projects.Find(id);
            if (project == null)
            {
                return NotFound();
            }

            ProjectDTO temp = new ProjectDTO();
            temp.ProjectID = project.ProjectID;
            temp.ProjectName = project.ProjectName;
            temp.ProjectContent = project.ProjectContent;
            temp.DateCreated = project.DateCreated;
            temp.LastUpdated = project.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileProjects/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutProject(string id, Project project)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != project.ProjectID)
            {
                return BadRequest();
            }

            db.Entry(project).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
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

        // POST: api/MobileProjects
        [ResponseType(typeof(Project))]
        public IHttpActionResult PostProject(Project project)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Projects.Add(project);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ProjectExists(project.ProjectID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new ProjectDTO()
            {
                ProjectID = project.ProjectID,
                ProjectName = project.ProjectName,
                ProjectContent = project.ProjectContent,
                DateCreated = project.DateCreated,
                LastUpdated = project.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = project.ProjectID }, dto);
        }

        // DELETE: api/MobileProjects/5
        [ResponseType(typeof(Project))]
        public IHttpActionResult DeleteProject(string id)
        {
            Project project = db.Projects.Find(id);
            if (project == null)
            {
                return NotFound();
            }

            db.Projects.Remove(project);
            db.SaveChanges();

            ProjectDTO temp = new ProjectDTO();
            temp.ProjectID = project.ProjectID;
            temp.ProjectName = project.ProjectName;
            temp.ProjectContent = project.ProjectContent;
            temp.DateCreated = project.DateCreated;
            temp.LastUpdated = project.LastUpdated;
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

        private bool ProjectExists(string id)
        {
            return db.Projects.Count(e => e.ProjectID == id) > 0;
        }
    }
}