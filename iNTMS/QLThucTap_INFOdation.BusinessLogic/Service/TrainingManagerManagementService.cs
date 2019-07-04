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
    public class TrainingManagerManagementService : ITrainingManagerManagementService
    {
        private readonly UnitOfWorkTrainingManager _unitOfWork;
        public TrainingManagerManagementService()
        {
            _unitOfWork = new UnitOfWorkTrainingManager();
        }
        public TrainingManager GetTrainingManagerById(string id)
        {
            return _unitOfWork.TrainingManagerRepository.GetByID(id);

        }
        public IEnumerable<TrainingManager> GetAllTrainingManagers()
        {
            return _unitOfWork.TrainingManagerRepository.GetAll().ToList();
        }
        public string CreateTrainingManager(TrainingManager userEntity)
        {
            userEntity.DateCreated = DateTime.Now;
            userEntity.LastUpdated = DateTime.Now;
            var s = from trm in _unitOfWork.TrainingManagerRepository.GetAll() select trm;
            if (s.LastOrDefault() != null)
            {
                string temp = s.LastOrDefault().TrainingManagerID.Substring(4);
                userEntity.TrainingManagerID = "TRM_" + AutoIncreseString(temp);
            }
            else
                userEntity.TrainingManagerID = "TRM_000001";


            _unitOfWork.TrainingManagerRepository.Insert(userEntity);
            _unitOfWork.Save();
            return userEntity.TrainingManagerID;

        }
        public bool UpdateTrainingManager(string id, TrainingManager userEntity)
        {
            var success = false;
            if (userEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.TrainingManagerRepository.GetByID(id);
                    if (usr != null)
                    {
                        usr.AssertmentContent = userEntity.AssertmentContent;
                        usr.IsPass = userEntity.IsPass;
                        usr.InternshipID = userEntity.InternshipID;
                        usr.ManagerID = userEntity.ManagerID;
                        usr.StudentID = userEntity.StudentID;
                        usr.StageID = userEntity.StageID;
                        usr.TrainingProgramID = userEntity.TrainingProgramID;                        
                        usr.LastUpdated = DateTime.Now;
                        _unitOfWork.TrainingManagerRepository.Update(usr);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
        public bool DeleteTrainingManager(string id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var usr = _unitOfWork.TrainingManagerRepository.GetByID(id);
                if (usr != null)
                {

                    _unitOfWork.TrainingManagerRepository.Delete(usr);
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
