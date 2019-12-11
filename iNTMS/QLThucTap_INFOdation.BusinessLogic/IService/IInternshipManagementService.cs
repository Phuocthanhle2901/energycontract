using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IInternshipManagementService
    {
        Internship GetProjectById(string id);
        IEnumerable<Internship> GetAllProjects();
        string CreateProject(Internship project);
        bool UpdateProject(string id, Internship project);
        bool DeleteProject(string id);
    }
}
