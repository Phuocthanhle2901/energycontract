using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IEmailTemplateManagementService
    {
        EmailTemplate GetEmailTemplateById(int id);
        IEnumerable<EmailTemplate> GetAllEmailTemplates();
        int CreateEmailTemplate(EmailTemplate function);
        bool UpdateEmailTemplate(int id, EmailTemplate function);
        bool DeleteEmailTemplate(int id);
    }
}
