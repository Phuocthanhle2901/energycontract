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
    public class MobileStudentCVsController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileStudentCVs
        public IQueryable<StudentCV> GetStudentCVs()
        {
            return db.StudentCVs;
        }

        // GET: api/MobileStudentCVs/5
        [ResponseType(typeof(StudentCV))]
        public IHttpActionResult GetStudentCV(int id)
        {
            StudentCV studentCV = db.StudentCVs.Find(id);
            if (studentCV == null)
            {
                return NotFound();
            }

            return Ok(studentCV);
        }

        // PUT: api/MobileStudentCVs/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutStudentCV(int id, StudentCV studentCV)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != studentCV.ID)
            {
                return BadRequest();
            }

            db.Entry(studentCV).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentCVExists(id))
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

        // POST: api/MobileStudentCVs
        [ResponseType(typeof(StudentCV))]
        public IHttpActionResult PostStudentCV(StudentCV studentCV)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.StudentCVs.Add(studentCV);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = studentCV.ID }, studentCV);
        }

        // DELETE: api/MobileStudentCVs/5
        [ResponseType(typeof(StudentCV))]
        public IHttpActionResult DeleteStudentCV(int id)
        {
            StudentCV studentCV = db.StudentCVs.Find(id);
            if (studentCV == null)
            {
                return NotFound();
            }

            db.StudentCVs.Remove(studentCV);
            db.SaveChanges();

            return Ok(studentCV);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StudentCVExists(int id)
        {
            return db.StudentCVs.Count(e => e.ID == id) > 0;
        }
    }
}