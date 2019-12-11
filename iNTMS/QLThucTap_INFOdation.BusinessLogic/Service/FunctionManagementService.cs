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
    public class FunctionManagementService : IFunctionManagementService
    {
        private readonly UnitOfWorkFunction _unitOfWork;
        public FunctionManagementService()
        {
            _unitOfWork = new UnitOfWorkFunction();
        }
        public Function GetFunctionById(int id)
        {
            return _unitOfWork.FunctionRepository.GetByID(id);

        }
        public IEnumerable<Function> GetAllFunctions()
        {
            return _unitOfWork.FunctionRepository.GetAll().ToList();
        }
        public int CreateFunction(Function functionEntity)
        {
            functionEntity.DateCreated = DateTime.Now;
            functionEntity.LastUpdated = DateTime.Now;
            _unitOfWork.FunctionRepository.Insert(functionEntity);
            _unitOfWork.Save();
            return functionEntity.FunctionID;

        }
        public bool UpdateFunction(int id, Function functionEntity)
        {
            var success = false;
            if (functionEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var function = _unitOfWork.FunctionRepository.GetByID(id);
                    if (function != null)
                    {                        
                        function.FunctionName = functionEntity.FunctionName;
                        function.LastUpdated = DateTime.Now;

                        _unitOfWork.FunctionRepository.Update(function);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
        public bool DeleteFunction(int id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var function = _unitOfWork.FunctionRepository.GetByID(id);
                if (function != null)
                {

                    _unitOfWork.FunctionRepository.Delete(function);
                    _unitOfWork.Save();
                    scope.Complete();
                    success = true;
                }
            }

            return success;
        }
    }
}
