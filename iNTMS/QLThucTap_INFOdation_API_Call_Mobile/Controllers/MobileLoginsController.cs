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
    public class MobileLoginsController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileLogins
        public IQueryable<LoginDTO> GetLogins()
        {
            var lstLogin = from s in db.Logins
                             select new LoginDTO()
                             {
                                 Username = s.Username,
                                 Password = s.Password,
                                 RoleID = s.RoleID,
                                 Email = s.Email,
                                 DateCreated = s.DateCreated,
                                 LastUpdated = s.LastUpdated
                             };
            return lstLogin;
        }

        // GET: api/MobileLogins/5
        [ResponseType(typeof(Login))]
        public IHttpActionResult GetLogin(string id)
        {
            Login login = db.Logins.Find(id);
            if (login == null)
            {
                return NotFound();
            }

            LoginDTO temp = new LoginDTO();
            temp.Username = login.Username;
            temp.Password = login.Password;
            temp.RoleID = login.RoleID;
            temp.Email = login.Email;
            temp.DateCreated = login.DateCreated;
            temp.LastUpdated = login.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileLogins/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutLogin(string id, Login login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != login.Username)
            {
                return BadRequest();
            }

            db.Entry(login).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoginExists(id))
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

        // POST: api/MobileLogins
        [ResponseType(typeof(LoginDTO))]
        public IHttpActionResult PostLogin(Login login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Logins.Add(login);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (LoginExists(login.Username))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new LoginDTO()
            {
                Username = login.Username,
                Password = login.Password,
                RoleID = login.RoleID,
                Email = login.Email,
                DateCreated = login.DateCreated,
                LastUpdated = login.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = login.Username }, dto);
        }

        // DELETE: api/MobileLogins/5
        [ResponseType(typeof(Login))]
        public IHttpActionResult DeleteLogin(string id)
        {
            Login login = db.Logins.Find(id);
            if (login == null)
            {
                return NotFound();
            }

            db.Logins.Remove(login);
            db.SaveChanges();

            LoginDTO temp = new LoginDTO();
            temp.Username = login.Username;
            temp.Password = login.Password;
            temp.RoleID = login.RoleID;
            temp.Email = login.Email;
            temp.DateCreated = login.DateCreated;
            temp.LastUpdated = login.LastUpdated;
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

        private bool LoginExists(string id)
        {
            return db.Logins.Count(e => e.Username == id) > 0;
        }
    }
}