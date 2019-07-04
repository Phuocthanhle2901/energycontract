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
    public class ProjectInternManagerManagementService : IProjectInternManagerManagementService
    {
        private readonly UnitOfWorkProjectInternManager _unitOfWork;
        private readonly UnitOfWorkStudent _unitOfWorkstd;
        public ProjectInternManagerManagementService()
        {
            _unitOfWork = new UnitOfWorkProjectInternManager();
            _unitOfWorkstd = new UnitOfWorkStudent();
        }
        public ProjectInternManager GetProjectById(string id)
        {
            return _unitOfWork.ProjectManagerRepository.GetByID(id);

        }
        public IEnumerable<ProjectInternManager> GetAllProjects()
        {
            return _unitOfWork.ProjectManagerRepository.GetAll().ToList();
        }

        public IEnumerable<ProjectInternManager> GetAllProjectsByStudentID(string id)
        {
            List<ProjectInternManager> projectInternManagers = new List<ProjectInternManager>();
            var s = from project in _unitOfWork.ProjectManagerRepository.GetAll() where project.StudentID == id select project;
            foreach (var item in s)
            {
                projectInternManagers.Add(item);
            }
            return projectInternManagers;
        }
        public string CreateProject(ProjectInternManager userEntity)
        {
            userEntity.DateCreated = DateTime.Now;
            userEntity.LastUpdated = DateTime.Now;
            var s = from pim in _unitOfWork.ProjectManagerRepository.GetAll() select pim;
            if (s.LastOrDefault() != null)
            {
                string temp = s.LastOrDefault().ProjectInternManagerID.Substring(4);
                userEntity.ProjectInternManagerID = "PIM_" + AutoIncreseString(temp);
            }
            else
                userEntity.ProjectInternManagerID = "PIM_000001";


            _unitOfWork.ProjectManagerRepository.Insert(userEntity);
            _unitOfWork.Save();
            return userEntity.ProjectInternID;

        }
        public bool UpdateProject(string id, ProjectInternManager userEntity)
        {
            var success = false;
            if (userEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.ProjectManagerRepository.GetByID(id);
                    if (usr != null)
                    {
                        
                        usr.ProjectInternID = userEntity.ProjectInternID;
                        usr.ManagerID = userEntity.ManagerID;
                        usr.StudentID = userEntity.StudentID;                     
                        usr.InternshipID = userEntity.InternshipID;
                        usr.IsPass = userEntity.IsPass;
                        usr.LastUpdated = DateTime.Now;
                        _unitOfWork.ProjectManagerRepository.Update(usr);
                        _unitOfWork.Save();
                        if (usr.IsPass == true)
                        {                            
                            var std = _unitOfWorkstd.StudentRepository.GetByID(usr.StudentID);
                            if(std != null)
                            {
                                std.ProgressID = "PROGRESS_002";
                                _unitOfWorkstd.StudentRepository.Update(std);
                                _unitOfWorkstd.Save();
                            }                            
                        }
                        scope.Complete();
                        success = true;
                        
                    }
                }                
            }
            return success;
        }
        public bool DeleteProject(string id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var usr = _unitOfWork.ProjectManagerRepository.GetByID(id);
                if (usr != null)
                {

                    _unitOfWork.ProjectManagerRepository.Delete(usr);
                    _unitOfWork.Save();
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
