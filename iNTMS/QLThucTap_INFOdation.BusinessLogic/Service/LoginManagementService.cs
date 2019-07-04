using QLThucTap_INFOdation.BusinessLogic.IService;
using Repository.Models;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace QLThucTap_INFOdation.BusinessLogic.Service
{
    public class LoginManagementService : ILoginManagementService
    {
        private readonly UnitOfWorkLogin _unitOfWork;
        public LoginManagementService()
        {
            _unitOfWork = new UnitOfWorkLogin();
        }
        public Login GetLoginById(string id)
        {
            return _unitOfWork.LoginRepository.GetByID(id);

        }
        public Login GetLoginByUsername(string name)
        {
            return _unitOfWork.LoginRepository.GetByID(name);

        }
        public IEnumerable<Login> GetAllLogins()
        {
            return _unitOfWork.LoginRepository.GetAll().ToList();
        }
        public string CreateLogin(Login loginEntity)
        {
            _unitOfWork.LoginRepository.Insert(loginEntity);
            _unitOfWork.Save();
            return loginEntity.Username;

        }
        public bool UpdateLogin(string id, Login loginEntity)
        {
            var success = false;
            if (loginEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.LoginRepository.GetByID(id);
                    if (usr != null)
                    {
                        //usr.Username = loginEntity.Username;
                        usr.Password = loginEntity.Password;
                        //usr.RoleID = loginEntity.RoleID;                        
                        usr.LastUpdated = DateTime.Now;
                        _unitOfWork.LoginRepository.Update(usr);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
        public bool DeleteLogin(string id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var usr = _unitOfWork.LoginRepository.GetByID(id);
                if (usr != null)
                {

                    _unitOfWork.LoginRepository.Delete(usr);
                    _unitOfWork.Save();
                    scope.Complete();
                    success = true;
                }
            }

            return success;
        }
    }
}
