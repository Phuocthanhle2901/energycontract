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
    public class MobileRolesController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileRoles
        public IQueryable<RoleDTO> GetRoles()
        {
            var lstRoles = from s in db.Roles
                           select new RoleDTO()
                           {
                               RoleID = s.RoleID,
                               RoleName = s.RoleName,
                               DateCreated = s.DateCreated,
                               LastUpdated = s.LastUpdated
                           };
            return lstRoles;
        }

        // GET: api/MobileRoles/5
        [ResponseType(typeof(Role))]
        public IHttpActionResult GetRole(int id)
        {
            Role role = db.Roles.Find(id);
            if (role == null)
            {
                return NotFound();
            }

            RoleDTO temp = new RoleDTO();
            temp.RoleID = role.RoleID;
            temp.RoleName = role.RoleName;
            temp.DateCreated = role.DateCreated;
            temp.LastUpdated = role.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileRoles/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutRole(int id, Role role)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != role.RoleID)
            {
                return BadRequest();
            }

            db.Entry(role).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
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

        // POST: api/MobileRoles
        [ResponseType(typeof(RoleDTO))]
        public IHttpActionResult PostRole(Role role)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Roles.Add(role);
            db.SaveChanges();
            var dto = new RoleDTO()
            {
                RoleID = role.RoleID,
                RoleName = role.RoleName,
                DateCreated = role.DateCreated,
                LastUpdated = role.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = role.RoleID }, dto);
        }

        // DELETE: api/MobileRoles/5
        [ResponseType(typeof(Role))]
        public IHttpActionResult DeleteRole(int id)
        {
            Role role = db.Roles.Find(id);
            if (role == null)
            {
                return NotFound();
            }

            db.Roles.Remove(role);
            db.SaveChanges();

            RoleDTO temp = new RoleDTO();
            temp.RoleID = role.RoleID;
            temp.RoleName = role.RoleName;
            temp.DateCreated = role.DateCreated;
            temp.LastUpdated = role.LastUpdated;
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

        private bool RoleExists(int id)
        {
            return db.Roles.Count(e => e.RoleID == id) > 0;
        }
    }
}