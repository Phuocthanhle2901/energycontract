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
    public class ProjectManagementService : IProjectManagementService
    {
        private readonly UnitOfWorkProject _unitOfWork;
        public ProjectManagementService()
        {
            _unitOfWork = new UnitOfWorkProject();
        }
        public Project GetProjectById(string id)
        {
            return _unitOfWork.ProjectRepository.GetByID(id);

        }
        public IEnumerable<Project> GetAllProjects()
        {
            return _unitOfWork.ProjectRepository.GetAll().ToList();
        }
        public string CreateProject(Project userEntity)
        {
            userEntity.DateCreated = DateTime.Now;
            userEntity.LastUpdated = DateTime.Now;
            var s = from prj in _unitOfWork.ProjectRepository.GetAll() select prj;
            if (s.LastOrDefault() != null)
            {
                string temp = s.LastOrDefault().ProjectID.Substring(4);
                userEntity.ProjectID = "PRJ_" + AutoIncreseString(temp);
            }
            else
                userEntity.ProjectID = "PRJ_000001";
            _unitOfWork.ProjectRepository.Insert(userEntity);
            _unitOfWork.Save();
            return userEntity.ProjectID;

        }
        public bool UpdateProject(string id, Project userEntity)
        {
            var success = false;
            if (userEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.ProjectRepository.GetByID(id);
                    if (usr != null)
                    {
                        usr.ProjectName = userEntity.ProjectName;
                        usr.ProjectContent = userEntity.ProjectContent;                        
                        usr.LastUpdated = DateTime.Now;                        
                        _unitOfWork.ProjectRepository.Update(usr);
                        _unitOfWork.Save();
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
                    var usr = _unitOfWork.ProjectRepository.GetByID(id);
                    if (usr != null)
                    {

                        _unitOfWork.ProjectRepository.Delete(usr);
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
