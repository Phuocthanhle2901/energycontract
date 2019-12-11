using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using System.Web.ModelBinding;
using QLThucTap_INFOdation.BusinessLogic.IService;
using Repository.DAL;
using Repository.Models;
using Repository.UnitOfWork;

namespace QLThucTap_INFOdation.BusinessLogic.Service
{
    public class ManagerManagementService : IManagerManagementService
    {
        private readonly UnitOfWorkManager _unitOfWork;
        private readonly UnitOfWorkLogin _unitLogin;
        private readonly UnitOfWorkSuperManager _unitSM;

        public ManagerManagementService()
        {
            _unitOfWork = new UnitOfWorkManager();
            _unitLogin = new UnitOfWorkLogin();
            _unitSM = new UnitOfWorkSuperManager();
        }
        public Manager GetManagerById(string id)
        {
            return _unitOfWork.ManagerRepository.GetByID(id);

        }
        public IEnumerable<Manager> GetAllManagers()
        {
            return _unitOfWork.ManagerRepository.GetAll().ToList();
        }        
        public string CreateManager(Manager managerEntity)
        {
            managerEntity.DateCreated = DateTime.Now;
            managerEntity.LastUpdated = DateTime.Now;
            var s = from mng in _unitOfWork.ManagerRepository.GetAll() select mng;
            if (s.LastOrDefault() != null)
            {
                string temp = s.LastOrDefault().ManagerID.Substring(4);
                managerEntity.ManagerID = "MNG_" + AutoIncreseString(temp);
            }
            else
                managerEntity.ManagerID = "MNG_000001";
            _unitOfWork.ManagerRepository.Insert(managerEntity);
            _unitOfWork.Save();
            Login login = new Login();
            login.Username = managerEntity.ManagerID;
            login.Email = managerEntity.Email;
            login.Password = "1";
            login.RoleID = 2;
            login.DateCreated = DateTime.Now;
            login.LastUpdated = DateTime.Now;
            _unitLogin.LoginRepository.Insert(login);
            _unitLogin.Save();
            if(managerEntity.IsSuperManager == true)
            {
                SuperManager sm = new SuperManager();
                sm.SMID = managerEntity.ManagerID;
                sm.Email = managerEntity.Email;
                _unitSM.SuperManagerRepository.Insert(sm);
                _unitSM.Save();
            }
            return managerEntity.ManagerID;

        }
        public bool UpdateManager(string id, Manager managerEntity)
        {
            var success = false;
            if (managerEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var usr = _unitOfWork.ManagerRepository.GetByID(id);
                    if (usr != null)
                    {
                        var isExist = IsEmailExist(managerEntity.ManagerID);
                        if (isExist)
                        {
                            
                        }
                        usr.Name = managerEntity.Name;
                        usr.Email = managerEntity.Email;
                        usr.PhoneNumber = managerEntity.PhoneNumber;
                        usr.IsSuperManager = managerEntity.IsSuperManager;
                        usr.LastUpdated = DateTime.Now;
                        _unitOfWork.ManagerRepository.Update(usr);
                        _unitOfWork.Save();
                        if (managerEntity.IsSuperManager == true)
                        {
                            if (isExist) { }
                            else
                            {
                                SuperManager sm = new SuperManager();
                                sm.SMID = managerEntity.ManagerID;
                                sm.Email = managerEntity.Email;
                                _unitSM.SuperManagerRepository.Insert(sm);
                                _unitSM.Save();
                            }
                            

                        }
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
        public bool DeleteManager(string id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var usr = _unitOfWork.ManagerRepository.GetByID(id);
                if (usr != null)
                {

                    _unitOfWork.ManagerRepository.Delete(usr);
                    _unitOfWork.Save();
                    var _delLog = _unitLogin.LoginRepository.GetByID(id);
                    var _delLogSM = _unitSM.SuperManagerRepository.GetByID(id);
                    if (_delLog != null)
                    {
                        _unitLogin.LoginRepository.Delete(_delLog);
                        _unitLogin.Save();
                    }
                    if (_delLogSM != null)
                    {
                        _unitSM.SuperManagerRepository.Delete(_delLogSM);
                        _unitSM.Save();
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
        public bool IsEmailExist(string id)
        {
            using (InternContext dc = new InternContext())
            {
                var v = dc.SuperManagers.Where(a => a.SMID == id).FirstOrDefault();
                return v != null;
            }
        }
    }
}
