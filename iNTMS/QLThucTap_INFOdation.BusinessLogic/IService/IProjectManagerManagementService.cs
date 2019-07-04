using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IProjectManagerManagementService
    {
        ProjectManager GetProjectById(string id);
        IEnumerable<ProjectManager> GetAllProjects();
        string CreateProject(ProjectManager project);
        bool UpdateProject(string id, ProjectManager project);
        bool DeleteProject(string id);
    }
}
