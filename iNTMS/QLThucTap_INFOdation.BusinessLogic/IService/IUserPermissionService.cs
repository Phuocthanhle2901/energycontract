using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IUserPermissionService
    {
        UserPermission GetUserPermissionById(int id);
        List<string> GetUserPermissionByUsername(string username);
        IEnumerable<UserPermission> GetAllUserPermissions();
        int CreateUserPermission(UserPermission userPermission);
        bool UpdateUserPermission(int id, UserPermission userPermission);
        bool DeleteUserPermission(int id);
    }
}
