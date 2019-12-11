using QLThucTap_INFOdation.BusinessLogic.IService;
using Repository.DAL;
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
    public class UserPermissionService : IUserPermissionService
    {
        private readonly UnitOfWorkUserPermission _unitOfWork;
        public UserPermissionService()
        {
            _unitOfWork = new UnitOfWorkUserPermission();
        }
        public int CreateUserPermission(UserPermission userPermission)
        {
            userPermission.DateCreated = DateTime.Now;
            userPermission.LastUpdated = DateTime.Now;
            _unitOfWork.UserPermissionRepository.Insert(userPermission);
            _unitOfWork.Save();
            return userPermission.UserPermissionID;
        }

        public bool DeleteUserPermission(int id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var function = _unitOfWork.UserPermissionRepository.GetByID(id);
                if (function != null)
                {

                    _unitOfWork.UserPermissionRepository.Delete(function);
                    _unitOfWork.Save();
                    scope.Complete();
                    success = true;
                }
            }

            return success;
        }

        public IEnumerable<UserPermission> GetAllUserPermissions()
        {
            return _unitOfWork.UserPermissionRepository.GetAll().ToList();
        }

        public UserPermission GetUserPermissionById(int id)
        {
            return _unitOfWork.UserPermissionRepository.GetByID(id);
        }

        public List<string> GetUserPermissionByUsername(string username)
        {
            List<string> permission = new List<string>();
            using (var db = new InternContext())
            {
                var query = from per in db.UserPermissions
                            join func in db.Functions on per.FunctionID equals func.FunctionID
                            where per.Username.Equals(username)
                            select func.FunctionName;
                foreach (var item in query)
                {
                    permission.Add(item);
                }
            }
            return permission;
        }

        public bool UpdateUserPermission(int id, UserPermission userPermission)
        {
            var success = false;
            if (userPermission != null)
            {
                using (var scope = new TransactionScope())
                {
                    var permission = _unitOfWork.UserPermissionRepository.GetByID(id);
                    if (permission != null)
                    {
                        permission.Username = userPermission.Username;
                        permission.FunctionID = userPermission.FunctionID;                        
                        permission.LastUpdated = DateTime.Now;

                        _unitOfWork.UserPermissionRepository.Update(permission);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
    }
}
