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
    public class ContactManagementService : IContactManagementService
    {
        private readonly UnitOfWorkContact _unitOfWork;
        public ContactManagementService()
        {
            _unitOfWork = new UnitOfWorkContact();
        }
        public Contact GetFunctionById(int id)
        {
            return _unitOfWork.FunctionRepository.GetByID(id);

        }
        public IEnumerable<Contact> GetAllFunctions()
        {
            return _unitOfWork.FunctionRepository.GetAll().ToList();
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
