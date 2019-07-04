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
    public class MobileManagersController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileManagers
        public IQueryable<ManagerDTO> GetManagers()
        {
            var lstManagers = from m in db.Managers
                             select new ManagerDTO()
                             {
                                 ManagerID = m.ManagerID,
                                 Name = m.Name,
                                 Email = m.Email,
                                 PhoneNumber = m.PhoneNumber,
                                 DateCreated = m.DateCreated,
                                 LastUpdated = m.LastUpdated
                             };
            return lstManagers;
        }

        // GET: api/MobileManagers/5
        [ResponseType(typeof(Manager))]
        public IHttpActionResult GetManager(string id)
        {
            Manager manager = db.Managers.Find(id);
            if (manager == null)
            {
                return NotFound();
            }

            ManagerDTO temp = new ManagerDTO();
            temp.ManagerID = manager.ManagerID;
            temp.Name = manager.Name;
            temp.Email = manager.Email;
            temp.PhoneNumber = manager.PhoneNumber;
            temp.DateCreated = manager.DateCreated;
            temp.LastUpdated = manager.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileManagers/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutManager(string id, Manager manager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != manager.ManagerID)
            {
                return BadRequest();
            }

            db.Entry(manager).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ManagerExists(id))
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

        // POST: api/MobileManagers
        [ResponseType(typeof(ManagerDTO))]
        public IHttpActionResult PostManager(Manager manager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Managers.Add(manager);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ManagerExists(manager.ManagerID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new ManagerDTO()
            {
                ManagerID = manager.ManagerID,
                Name = manager.Name,
                Email = manager.Email,
                PhoneNumber = manager.PhoneNumber,
                DateCreated = manager.DateCreated,
                LastUpdated = manager.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = manager.ManagerID }, dto);
        }

        // DELETE: api/MobileManagers/5
        [ResponseType(typeof(Manager))]
        public IHttpActionResult DeleteManager(string id)
        {
            Manager manager = db.Managers.Find(id);
            if (manager == null)
            {
                return NotFound();
            }

            db.Managers.Remove(manager);
            db.SaveChanges();

            ManagerDTO temp = new ManagerDTO();
            temp.ManagerID = manager.ManagerID;
            temp.Name = manager.Name;
            temp.Email = manager.Email;
            temp.PhoneNumber = manager.PhoneNumber;
            temp.DateCreated = manager.DateCreated;
            temp.LastUpdated = manager.LastUpdated;
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

        private bool ManagerExists(string id)
        {
            return db.Managers.Count(e => e.ManagerID == id) > 0;
        }
    }
}