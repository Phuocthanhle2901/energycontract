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
    public class EmailTemplateManagementService : IEmailTemplateManagementService
    {
        private readonly UnitOfWorkEmailTemplate _unitOfWork;
        public EmailTemplateManagementService()
        {
            _unitOfWork = new UnitOfWorkEmailTemplate();
        }
        public EmailTemplate GetEmailTemplateById(int id)
        {
            return _unitOfWork.EmailTemplateRepository.GetByID(id);

        }
        public IEnumerable<EmailTemplate> GetAllEmailTemplates()
        {
            return _unitOfWork.EmailTemplateRepository.GetAll().ToList();
        }
        public int CreateEmailTemplate(EmailTemplate functionEntity)
        {            
            _unitOfWork.EmailTemplateRepository.Insert(functionEntity);
            _unitOfWork.Save();
            return functionEntity.id;

        }
        public bool UpdateEmailTemplate(int id, EmailTemplate functionEntity)
        {
            var success = false;
            if (functionEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var function = _unitOfWork.EmailTemplateRepository.GetByID(id);
                    if (function != null)
                    {
                        function.EmailFor = functionEntity.EmailFor;
                        function.Subject = functionEntity.Subject;
                        function.Body1 = functionEntity.Body1;
                        function.Body2 = functionEntity.Body2;
                        function.Body3 = functionEntity.Body3;
                        function.Body4 = functionEntity.Body4;

                        _unitOfWork.EmailTemplateRepository.Update(function);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }
        public bool DeleteEmailTemplate(int id)
        {
            var success = false;

            using (var scope = new TransactionScope())
            {
                var function = _unitOfWork.EmailTemplateRepository.GetByID(id);
                if (function != null)
                {

                    _unitOfWork.EmailTemplateRepository.Delete(function);
                    _unitOfWork.Save();
                    scope.Complete();
                    success = true;
                }
            }

            return success;
        }
    }
}
