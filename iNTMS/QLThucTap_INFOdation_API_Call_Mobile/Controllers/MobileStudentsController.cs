
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
    public class MobileStudentsController : ApiController
    {
        private InternContext db = new InternContext();

        // GET: api/MobileStudents
        public IQueryable<StudentDTO> GetStudents()
        {
            var lstStudent = from s in db.Students
                             select new StudentDTO()
                             {
                                 StudentID = s.StudentID,
                                 Name = s.Name,
                                 Address = s.Address,
                                 Email = s.Email,
                                 Birthday = s.Birthday,
                                 PhoneNumber = s.PhoneNumber,
                                 Gender = s.Gender,
                                 Unit = s.Unit,
                                 Info = s.Info,
                                 ProgressID = s.ProgressID,
                                 DateCreated = s.DateCreated,
                                 LastUpdated = s.LastUpdated
                             };
            return lstStudent;
        }

        // GET: api/MobileStudents/5
        [ResponseType(typeof(Student))]
        public async Task<IHttpActionResult> GetStudent(string id)
        {
            Student s = await db.Students.FindAsync(id);
            if (s == null)
            {
                return NotFound();
            }

            StudentDTO temp = new StudentDTO();
            temp.StudentID = s.StudentID;
            temp.Name = s.Name;
            temp.Address = s.Address;
            temp.Email = s.Email;
            temp.Birthday = s.Birthday;
            temp.PhoneNumber = s.PhoneNumber;
            temp.Gender = s.Gender;
            temp.Unit = s.Unit;
            temp.Info = s.Info;
            temp.ProgressID = s.ProgressID;
            temp.DateCreated = s.DateCreated;
            temp.LastUpdated = s.LastUpdated;
            return Ok(temp);
        }

        // PUT: api/MobileStudents/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutStudent(string id, Student student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != student.StudentID)
            {
                return BadRequest();
            }

            db.Entry(student).State = EntityState.Modified;

            try
            { 
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
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

        // POST: api/MobileStudents
        [ResponseType(typeof(StudentDTO))]
        public async Task<IHttpActionResult> PostStudent(Student s)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            db.Students.Add(s);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StudentExists(s.StudentID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new StudentDTO()
            {
                StudentID = s.StudentID,
                Name = s.Name,
                Address = s.Address,
                Email = s.Email,
                Birthday = s.Birthday,
                PhoneNumber = s.PhoneNumber,
                Gender = s.Gender,
                Unit = s.Unit,
                Info = s.Info,
                ProgressID = s.ProgressID,
                DateCreated = s.DateCreated,
                LastUpdated = s.LastUpdated
            };
            return CreatedAtRoute("DefaultApi", new { id = s.StudentID }, dto);
        }

        // DELETE: api/MobileStudents/5
        [ResponseType(typeof(Student))]
        public async Task<IHttpActionResult> DeleteStudent(string id)
        {
            Student s = await db.Students.FindAsync(id);
            if (s == null)
            {
                return NotFound();
            }

            db.Students.Remove(s);
            await db.SaveChangesAsync();

            StudentDTO temp = new StudentDTO();
            temp.StudentID = s.StudentID;
            temp.Name = s.Name;
            temp.Address = s.Address;
            temp.Email = s.Email;
            temp.Birthday = s.Birthday;
            temp.PhoneNumber = s.PhoneNumber;
            temp.Gender = s.Gender;
            temp.Unit = s.Unit;
            temp.Info = s.Info;
            temp.ProgressID = s.ProgressID;
            temp.DateCreated = s.DateCreated;
            temp.LastUpdated = s.LastUpdated;
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

        private bool StudentExists(string id)
        {
            return db.Students.Count(e => e.StudentID == id) > 0;
        }
    }
}