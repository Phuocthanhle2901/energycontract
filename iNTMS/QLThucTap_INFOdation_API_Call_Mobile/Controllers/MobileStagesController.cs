using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Repository.DAL;
using Repository.Models;

namespace QLThucTap_INFOdation_API_Call_Mobile.Controllers
{
    public class MobileStagesController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileStages
        public IQueryable<StageDTO> GetStages()
        {
            var lstStages = from s in db.Stages
                           select new StageDTO()
                           {
                               StageID = s.StageID,
                               StageContent = s.StageContent,
                               DateCreated = s.DateCreated,
                               LastUpdated = s.LastUpdated
                           };
            return lstStages;
        }

        // GET: api/MobileStages/5
        [ResponseType(typeof(Stage))]
        public async Task<IHttpActionResult> GetStage(string id)
        {
            Stage stage = await db.Stages.FindAsync(id);
            if (stage == null)
            {
                return NotFound();
            }

            StageDTO temp = new StageDTO();
            temp.StageID = stage.StageID;
            temp.StageContent = stage.StageContent;
            temp.DateCreated = stage.DateCreated;
            temp.LastUpdated = stage.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileStages/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutStage(string id, Stage stage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != stage.StageID)
            {
                return BadRequest();
            }

            db.Entry(stage).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StageExists(id))
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

        // POST: api/MobileStages
        [ResponseType(typeof(StageDTO))]
        public async Task<IHttpActionResult> PostStage(Stage stage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Stages.Add(stage);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StageExists(stage.StageID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new StageDTO()
            {
                StageID = stage.StageID,
                StageContent = stage.StageContent,
                DateCreated = stage.DateCreated,
                LastUpdated = stage.LastUpdated
            };

            return CreatedAtRoute("DefaultApi", new { id = stage.StageID }, dto);
        }

        // DELETE: api/MobileStages/5
        [ResponseType(typeof(StageDTO))]
        public async Task<IHttpActionResult> DeleteStage(string id)
        {
            Stage stage = await db.Stages.FindAsync(id);
            if (stage == null)
            {
                return NotFound();
            }

            db.Stages.Remove(stage);
            await db.SaveChangesAsync();

            StageDTO temp = new StageDTO();
            temp.StageID = stage.StageID;
            temp.StageContent = stage.StageContent;
            temp.DateCreated = stage.DateCreated;
            temp.LastUpdated = stage.LastUpdated;
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

        private bool StageExists(string id)
        {
            return db.Stages.Count(e => e.StageID == id) > 0;
        }
    }
}