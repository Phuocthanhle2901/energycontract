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
    public class TrainingProgramManagementService : ITrainingProgramManagementService
    {
        private readonly UnitOfWorkTrainingProgram _unitOfWork;
        public TrainingProgramManagementService()
        {
            _unitOfWork = new UnitOfWorkTrainingProgram();
        }
        public TrainingProgram GetTrainingProgramById(string id)
        {
            return _unitOfWork.TrainingProgramRepository.GetByID(id);

        }
        public IEnumerable<TrainingProgram> GetAllTrainingPrograms()
        {
            return _unitOfWork.TrainingProgramRepository.GetAll().ToList();
        }
        public string CreateTrainingProgram(TrainingProgram userEntity)
        {
            userEntity.DateCreated = DateTime.Now;
            userEntity.LastUpdated = DateTime.Now;
            var s = from trp in _unitOfWork.TrainingProgramRepository.GetAll() select trp;
            if (s.LastOrDefault() != null)
            {
                string temp = s.LastOrDefault().TrainingProgramID.Substring(4);
                userEntity.TrainingProgramID = "TRP_" + AutoIncreseString(temp);
            }
            else
                userEntity.TrainingProgramID = "TRP_000001";


            _unitOfWork.TrainingProgramRepository.Insert(userEntity);
            _unitOfWork.Save();
            return userEntity.TrainingProgramID;

        }
        public bool UpdateTrainingProgram(string id, TrainingProgram userEntity)
        {
            var success = false;
            if (userEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.TrainingProgramRepository.GetByID(id);
                    if (usr != null)
                    {
                        usr.TrainingContent = userEntity.TrainingContent;
                        usr.SpecializeID = userEntity.SpecializeID;
                        usr.StartDate = userEntity.StartDate;
                        usr.EndDate = userEntity.EndDate;
                        usr.LastUpdated = DateTime.Now;
                        _unitOfWork.TrainingProgramRepository.Update(usr);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
        public bool DeleteTrainingProgram(string id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var usr = _unitOfWork.TrainingProgramRepository.GetByID(id);
                if (usr != null)
                {

                    _unitOfWork.TrainingProgramRepository.Delete(usr);
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
