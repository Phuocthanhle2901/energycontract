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
    public class MobileUserPermissionsController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileUserPermissions
        public IQueryable<UserPermissionDTO> GetUserPermissions()
        {
            var lstUserPermission = from s in db.UserPermissions
                                    select new UserPermissionDTO()
                                    {
                                        UserPermissionID = s.UserPermissionID,
                                        Username = s.Username,
                                        FunctionID = s.FunctionID,
                                        DateCreated = s.DateCreated,
                                        LastUpdated = s.LastUpdated
                                    };
            return lstUserPermission;
        }

        // GET: api/MobileUserPermissions/5
        [ResponseType(typeof(UserPermissionDTO))]
        public IHttpActionResult GetUserPermission(int id)
        {
            UserPermission userPermission = db.UserPermissions.Find(id);
            if (userPermission == null)
            {
                return NotFound();
            }

            var temp = new UserPermissionDTO();
            temp.UserPermissionID = userPermission.UserPermissionID;
            temp.Username = userPermission.Username;
            temp.FunctionID = userPermission.FunctionID;
            temp.DateCreated = userPermission.DateCreated;
            temp.LastUpdated = userPermission.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileUserPermissions/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserPermission(int id, UserPermission userPermission)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userPermission.UserPermissionID)
            {
                return BadRequest();
            }

            db.Entry(userPermission).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserPermissionExists(id))
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

        // POST: api/MobileUserPermissions
        [ResponseType(typeof(UserPermissionDTO))]
        public IHttpActionResult PostUserPermission(UserPermission userPermission)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserPermissions.Add(userPermission);
            db.SaveChanges();

            var dto = new UserPermissionDTO()
            {
                UserPermissionID = userPermission.UserPermissionID,
                Username = userPermission.Username,
                FunctionID = userPermission.FunctionID,
                DateCreated = userPermission.DateCreated,
                LastUpdated = userPermission.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = userPermission.UserPermissionID }, dto);
        }

        // DELETE: api/MobileUserPermissions/5
        [ResponseType(typeof(UserPermission))]
        public IHttpActionResult DeleteUserPermission(int id)
        {
            UserPermission userPermission = db.UserPermissions.Find(id);
            if (userPermission == null)
            {
                return NotFound();
            }

            db.UserPermissions.Remove(userPermission);
            db.SaveChanges();

            var temp = new UserPermissionDTO();
            temp.UserPermissionID = userPermission.UserPermissionID;
            temp.Username = userPermission.Username;
            temp.FunctionID = userPermission.FunctionID;
            temp.DateCreated = userPermission.DateCreated;
            temp.LastUpdated = userPermission.LastUpdated;
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

        private bool UserPermissionExists(int id)
        {
            return db.UserPermissions.Count(e => e.UserPermissionID == id) > 0;
        }
    }
}