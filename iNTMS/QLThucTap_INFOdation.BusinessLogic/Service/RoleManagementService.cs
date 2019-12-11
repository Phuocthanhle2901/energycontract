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
    public class RoleManagementService : IRoleManagementService
    {
        private readonly UnitOfWorkRole _unitOfWork;
        public RoleManagementService()
        {
            _unitOfWork = new UnitOfWorkRole();
        }
        public Role GetRoleById(int id)
        {
            return _unitOfWork.RoleRepository.GetByID(id);

        }
        public IEnumerable<Role> GetAllRoles()
        {
            return _unitOfWork.RoleRepository.GetAll().ToList();
        }
        public int CreateRole(Role roleEntity)
        {
            _unitOfWork.RoleRepository.Insert(roleEntity);
            _unitOfWork.Save();
            return roleEntity.RoleID;

        }
        public bool UpdateRole(int id, Role roleEntity)
        {
            var success = false;
            if (roleEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var role = _unitOfWork.RoleRepository.GetByID(id);
                    if (role != null)
                    {
                        role.RoleID = roleEntity.RoleID;
                        role.RoleName = roleEntity.RoleName;                        
                        role.DateCreated = roleEntity.DateCreated;
                        role.LastUpdated = roleEntity.LastUpdated;

                        _unitOfWork.RoleRepository.Update(role);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
        public bool DeleteRole(int id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var role = _unitOfWork.RoleRepository.GetByID(id);
                if (role != null)
                {

                    _unitOfWork.RoleRepository.Delete(role);
                    _unitOfWork.Save();
                    scope.Complete();
                    success = true;
                }
            }

            return success;
        }
    }
}
