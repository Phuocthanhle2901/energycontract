using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using QLThucTap_INFOdation.BusinessLogic.IService;
using Repository.Models;
using Repository.UnitOfWork;

namespace QLThucTap_INFOdation.BusinessLogic.Service
{
    public class StudentCVManagementService : IStudentCVManagementService
    {
        private readonly UnitOfWorkStudentCV _unitOfWork;
        public StudentCVManagementService()
        {
            _unitOfWork = new UnitOfWorkStudentCV();
        }
        public StudentCV GetStudentById(int id)
        {
            return _unitOfWork.StudentRepository.GetByID(id);

        }
        public IEnumerable<StudentCV> GetAllStudents()
        {
            return _unitOfWork.StudentRepository.GetAll().ToList();
        }
        public int CreateStudent(StudentCV userEntity)
        {
            userEntity.InterviewSchedule = DateTime.Now;
            userEntity.Status = "Process";
            _unitOfWork.StudentRepository.Insert(userEntity);
            _unitOfWork.Save();
            return userEntity.ID;

        }
        public bool UpdateStudent(int id, StudentCV userEntity)
        {
            var success = false;
            if (userEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.StudentRepository.GetByID(id);
                    if (usr != null)
                    {
                        usr.InterviewSchedule = userEntity.InterviewSchedule;
                        usr.Status = userEntity.Status;                       
                        _unitOfWork.StudentRepository.Update(usr);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
        public bool DeleteStudent(int id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var usr = _unitOfWork.StudentRepository.GetByID(id);
                if (usr != null)
                {

                    _unitOfWork.StudentRepository.Delete(usr);
                    _unitOfWork.Save();
                    scope.Complete();
                    success = true;
                }
            }

            return success;
        }
    }
}
