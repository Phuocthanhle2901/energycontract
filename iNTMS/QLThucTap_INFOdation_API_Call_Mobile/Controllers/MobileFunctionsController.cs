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
    public class MobileFunctionsController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileFunctions
        public IQueryable<FunctionDTO> GetFunctions()
        {
            var lstFunctions = from s in db.Functions
                               select new FunctionDTO()
                               {
                                   FunctionID = s.FunctionID,
                                   FunctionName = s.FunctionName,
                                   DateCreated = s.DateCreated,
                                   LastUpdated = s.LastUpdated
                               };
            return lstFunctions;
        }

        // GET: api/MobileFunctions/5
        [ResponseType(typeof(FunctionDTO))]
        public IHttpActionResult GetFunction(int id)
        {
            Function function = db.Functions.Find(id);
            if (function == null)
            {
                return NotFound();
            }

            FunctionDTO temp = new FunctionDTO();
            temp.FunctionID = function.FunctionID;
            temp.FunctionName = function.FunctionName;
            temp.DateCreated = function.DateCreated;
            temp.LastUpdated = function.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileFunctions/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutFunction(int id, Function function)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != function.FunctionID)
            {
                return BadRequest();
            }

            db.Entry(function).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FunctionExists(id))
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

        // POST: api/MobileFunctions
        [ResponseType(typeof(FunctionDTO))]
        public IHttpActionResult PostFunction(Function function)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Functions.Add(function);
            db.SaveChanges();
            var dto = new FunctionDTO()
            {
                FunctionID = function.FunctionID,
                FunctionName = function.FunctionName,
                DateCreated = function.DateCreated,
                LastUpdated = function.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = function.FunctionID }, dto);
        }

        // DELETE: api/MobileFunctions/5
        [ResponseType(typeof(FunctionDTO))]
        public IHttpActionResult DeleteFunction(int id)
        {
            Function function = db.Functions.Find(id);
            if (function == null)
            {
                return NotFound();
            }

            db.Functions.Remove(function);
            db.SaveChanges();

            FunctionDTO temp = new FunctionDTO();
            temp.FunctionID = function.FunctionID;
            temp.FunctionName = function.FunctionName;
            temp.DateCreated = function.DateCreated;
            temp.LastUpdated = function.LastUpdated;
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

        private bool FunctionExists(int id)
        {
            return db.Functions.Count(e => e.FunctionID == id) > 0;
        }
    }
}