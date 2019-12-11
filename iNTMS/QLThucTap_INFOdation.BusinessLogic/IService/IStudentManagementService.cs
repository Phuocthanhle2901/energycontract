using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IStudentManagementService
    {
        Student GetStudentById(string id);
        IEnumerable<Student> GetAllStudents();
        string CreateStudent(Student student);
        bool UpdateStudent(string id, Student student);
        bool DeleteStudent(string id);
    }
}
