using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IProjectInternManagementService
    {
        ProjectIntern GetProjectById(string id);
        IEnumerable<ProjectIntern> GetAllProjects();
        string CreateProject(ProjectIntern project);
        bool UpdateProject(string id, ProjectIntern project);
        bool DeleteProject(string id);
    }
}
