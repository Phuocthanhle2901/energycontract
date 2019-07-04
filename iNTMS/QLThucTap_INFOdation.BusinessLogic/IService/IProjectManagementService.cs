using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IProjectManagementService
    {
        Project GetProjectById(string id);
        IEnumerable<Project> GetAllProjects();
        string CreateProject(Project project);
        bool UpdateProject(string id, Project project);
        bool DeleteProject(string id);
    }
}
