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
    public class MobileInternshipsController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileInternships
        public IQueryable<InternshipDTO> GetInternships()
        {
            var lstInternship = from s in db.Internships
                           select new InternshipDTO()
                           {
                               InternshipID = s.InternshipID,
                               InternshipName = s.InternshipName,
                               StartDate = s.StartDate,
                               EndDate = s.EndDate,
                               DateCreated = s.DateCreated,
                               LastUpdated = s.LastUpdated
                           };
            return lstInternship;
        }

        // GET: api/MobileInternships/5
        [ResponseType(typeof(Internship))]
        public IHttpActionResult GetInternship(string id)
        {
            Internship internship = db.Internships.Find(id);
            if (internship == null)
            {
                return NotFound();
            }

            InternshipDTO temp = new InternshipDTO();
            temp.InternshipID = internship.InternshipID;
            temp.InternshipName = internship.InternshipName;
            temp.StartDate = internship.StartDate;
            temp.EndDate = internship.EndDate;
            temp.DateCreated = internship.DateCreated;
            temp.LastUpdated = internship.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileInternships/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutInternship(string id, Internship internship)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != internship.InternshipID)
            {
                return BadRequest();
            }

            db.Entry(internship).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InternshipExists(id))
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

        // POST: api/MobileInternships
        [ResponseType(typeof(InternshipDTO))]
        public IHttpActionResult PostInternship(Internship internship)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Internships.Add(internship);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (InternshipExists(internship.InternshipID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new InternshipDTO()
            {
                InternshipID = internship.InternshipID,
                InternshipName = internship.InternshipName,
                StartDate = internship.StartDate,
                EndDate = internship.EndDate,
                DateCreated = internship.DateCreated,
                LastUpdated = internship.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = internship.InternshipID }, dto);
        }

        // DELETE: api/MobileInternships/5
        [ResponseType(typeof(Internship))]
        public IHttpActionResult DeleteInternship(string id)
        {
            Internship internship = db.Internships.Find(id);
            if (internship == null)
            {
                return NotFound();
            }

            db.Internships.Remove(internship);
            db.SaveChanges();

            InternshipDTO temp = new InternshipDTO();
            temp.InternshipID = internship.InternshipID;
            temp.InternshipName = internship.InternshipName;
            temp.StartDate = internship.StartDate;
            temp.EndDate = internship.EndDate;
            temp.DateCreated = internship.DateCreated;
            temp.LastUpdated = internship.LastUpdated;
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

        private bool InternshipExists(string id)
        {
            return db.Internships.Count(e => e.InternshipID == id) > 0;
        }
    }
}