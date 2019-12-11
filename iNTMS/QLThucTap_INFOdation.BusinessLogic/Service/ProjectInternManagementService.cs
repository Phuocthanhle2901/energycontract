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
    public class ProjectInternManagementService : IProjectInternManagementService
    {
        private readonly UnitOfWorkProjectIntern _unitOfWork;
        public ProjectInternManagementService()
        {
            _unitOfWork = new UnitOfWorkProjectIntern();
        }
        public ProjectIntern GetProjectById(string id)
        {
            return _unitOfWork.InternshipRepository.GetByID(id);

        }
        public IEnumerable<ProjectIntern> GetAllProjects()
        {
            return _unitOfWork.InternshipRepository.GetAll().ToList();
        }

        public string CreateProject(ProjectIntern userEntity)
        {
            userEntity.DateCreated = DateTime.Now;
            userEntity.LastUpdated = DateTime.Now;
            var s = from pri in _unitOfWork.InternshipRepository.GetAll() select pri;
            if (s.LastOrDefault() != null)
            {
                string temp = s.LastOrDefault().ProjectInternID.Substring(4);
                userEntity.ProjectInternID = "PRI_" + AutoIncreseString(temp);
            }
            else
                userEntity.ProjectInternID = "PRI_000001";


            _unitOfWork.InternshipRepository.Insert(userEntity);
            _unitOfWork.Save();
            return userEntity.ProjectInternID;

        }
        public bool UpdateProject(string id, ProjectIntern userEntity)
        {
            var success = false;
            if (userEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.InternshipRepository.GetByID(id);
                    if (usr != null)
                    {
                        usr.ProjectInternName = userEntity.ProjectInternName;
                        usr.ProjectInternContent = userEntity.ProjectInternContent;
                        usr.StartDate = userEntity.StartDate;
                        usr.EndDate = userEntity.EndDate;                        
                        usr.LastUpdated = DateTime.Now;
                        _unitOfWork.InternshipRepository.Update(usr);
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
                var usr = _unitOfWork.InternshipRepository.GetByID(id);
                if (usr != null)
                {

                    _unitOfWork.InternshipRepository.Delete(usr);
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
