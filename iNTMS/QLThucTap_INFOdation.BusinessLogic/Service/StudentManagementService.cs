using QLThucTap_INFOdation.BusinessLogic.IService;
using Repository.Models;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;

namespace QLThucTap_INFOdation.BusinessLogic.Service
{
    public class StudentManagementService : IStudentManagementService
    {
        private readonly UnitOfWorkStudent _unitOfWork;
        private readonly UnitOfWorkLogin _unitLogin;
        public StudentManagementService()
        {
            _unitOfWork = new UnitOfWorkStudent();
            _unitLogin = new UnitOfWorkLogin();
        }
        public Student GetStudentById(string id)
        {
            return _unitOfWork.StudentRepository.GetByID(id);

        }
        public IEnumerable<Student> GetAllStudents()
        {
            return _unitOfWork.StudentRepository.GetAll().ToList();
        }
        public string CreateStudent(Student studentEntity)
        {           
            studentEntity.DateCreated = DateTime.Now;
            studentEntity.LastUpdated = DateTime.Now;
            studentEntity.ProgressID = "PROGRESS_000";
            var s = from std in _unitOfWork.StudentRepository.GetAll() select std;
            if (s.LastOrDefault() != null)
            {
                string temp = s.LastOrDefault().StudentID.Substring(4);
                studentEntity.StudentID = "STD_" + AutoIncreseString(temp);
            }
            else
                studentEntity.StudentID = "STD_000001";
            _unitOfWork.StudentRepository.Insert(studentEntity);
            _unitOfWork.Save();
            Login login = new Login();
            login.Username = studentEntity.StudentID;
            login.Email = studentEntity.Email;
            login.Password = "1";

            login.DateCreated = DateTime.Now;
            login.LastUpdated = DateTime.Now;
            login.RoleID = 3;
            _unitLogin.LoginRepository.Insert(login);
            _unitLogin.Save();
            return studentEntity.StudentID;

        }
        public bool UpdateStudent(string id, Student studentEntity)
        {
            var success = false;
            if (studentEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.StudentRepository.GetByID(id);
                    if (usr != null)
                    {
                        usr.Name = studentEntity.Name;
                        usr.Birthday = studentEntity.Birthday;
                        usr.Email = studentEntity.Email;
                        usr.Address = studentEntity.Address;
                        usr.PhoneNumber = studentEntity.PhoneNumber;
                        usr.Unit = studentEntity.Unit;
                        usr.Info = studentEntity.Info;
                        //usr.ProgressID = studentEntity.ProgressID;
                        usr.LastUpdated = DateTime.Now;
                        _unitOfWork.StudentRepository.Update(usr);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
        public bool DeleteStudent(string id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var usr = _unitOfWork.StudentRepository.GetByID(id);
                if (usr != null)
                {

                    _unitOfWork.StudentRepository.Delete(usr);
                    _unitOfWork.Save();
                    var _delLog = _unitLogin.LoginRepository.GetByID(id);
                    if (_delLog != null)
                    {
                        _unitLogin.LoginRepository.Delete(_delLog);
                        _unitLogin.Save();
                    }
                    scope.Complete();
                    success = true;
                }
            }

            return success;
        }


        public string AutoIncreseString(string str)
        {
            int temp = Convert.ToInt32(str) + 1;
            return temp.ToString("D6");
        }
    }
}
