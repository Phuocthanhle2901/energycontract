using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IRoleManagementService
    {
        Role GetRoleById(int id);
        IEnumerable<Role> GetAllRoles();
        int CreateRole(Role role);
        bool UpdateRole(int id, Role role);
        bool DeleteRole(int id);
    }
}
