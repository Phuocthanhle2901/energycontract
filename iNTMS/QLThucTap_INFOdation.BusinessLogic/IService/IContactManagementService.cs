using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IContactManagementService
    {
        Contact GetFunctionById(int id);
        IEnumerable<Contact> GetAllFunctions();        
        bool DeleteFunction(int id);
    }
}
