using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IManagerManagementService
    {
        Manager GetManagerById(string id);
        IEnumerable<Manager> GetAllManagers();
        string CreateManager(Manager manager);
        bool UpdateManager(string id, Manager manager);
        bool DeleteManager(string id);
    }
}