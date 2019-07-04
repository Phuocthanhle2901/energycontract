using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IFunctionManagementService
    {
        Function GetFunctionById(int id);
        IEnumerable<Function> GetAllFunctions();
        int CreateFunction(Function function);
        bool UpdateFunction(int id, Function function);
        bool DeleteFunction(int id);
    }
}
