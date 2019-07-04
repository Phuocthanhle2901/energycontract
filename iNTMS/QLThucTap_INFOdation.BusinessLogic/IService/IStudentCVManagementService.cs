using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IStudentCVManagementService
    {
        StudentCV GetStudentById(int id);
        IEnumerable<StudentCV> GetAllStudents();
        int CreateStudent(StudentCV student);
        bool UpdateStudent(int id, StudentCV student);
        bool DeleteStudent(int id);
    }
}
