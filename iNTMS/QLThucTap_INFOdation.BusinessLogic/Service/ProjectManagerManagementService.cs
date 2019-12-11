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
    public class ProjectManagerManagementService : IProjectManagerManagementService
    {
        private readonly UnitOfWorkProjectManager _unitOfWork;
        private readonly UnitOfWorkStudent _unitOfWorkstd;
        public ProjectManagerManagementService()
        {
            _unitOfWork = new UnitOfWorkProjectManager();
            _unitOfWorkstd = new UnitOfWorkStudent();
        }
        public ProjectManager GetProjectById(string id)
        {
            return _unitOfWork.ProjectManagerRepository.GetByID(id);

        }
        public IEnumerable<ProjectManager> GetAllProjects()
        {
            return _unitOfWork.ProjectManagerRepository.GetAll().ToList();
        }
        public string CreateProject(ProjectManager userEntity)
        {
            userEntity.DateCreated = DateTime.Now;
            userEntity.LastUpdated = DateTime.Now;
            var s = from prm in _unitOfWork.ProjectManagerRepository.GetAll() select prm;
            if (s.LastOrDefault() != null)
            {
                string temp = s.LastOrDefault().ProjectManagerID.Substring(4);
                userEntity.ProjectManagerID = "PRM_" + AutoIncreseString(temp);
            }
            else
                userEntity.ProjectManagerID = "PRM_000001";
            _unitOfWork.ProjectManagerRepository.Insert(userEntity);
            _unitOfWork.Save();
            return userEntity.ProjectManagerID;

        }
        public bool UpdateProject(string id, ProjectManager userEntity)
        {
            var success = false;
            if (userEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.ProjectManagerRepository.GetByID(id);
                    if (usr != null)
                    {
                        usr.ProjectID = userEntity.ProjectID;
                        usr.ManagerID = userEntity.ManagerID;
                        usr.StudentID = userEntity.StudentID;
                        usr.IsPass = userEntity.IsPass;
                        usr.LastUpdated = DateTime.Now;
                        _unitOfWork.ProjectManagerRepository.Update(usr);
                        _unitOfWork.Save();
                        if (usr.IsPass == true)
                        {
                            var std = _unitOfWorkstd.StudentRepository.GetByID(usr.StudentID);
                            if (std != null)
                            {
                                std.ProgressID = "PROGRESS_003";
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
