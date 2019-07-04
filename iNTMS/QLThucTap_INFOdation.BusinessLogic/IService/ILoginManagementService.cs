using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface ILoginManagementService
    {
        Login GetLoginById(string id);
        Login GetLoginByUsername(string name);
        IEnumerable<Login> GetAllLogins();
        string CreateLogin(Login login);
        bool UpdateLogin(string id, Login login);
        bool DeleteLogin(string id);
    }
}
