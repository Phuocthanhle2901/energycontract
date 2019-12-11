using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface IProjectInternManagerManagementService
    {
        ProjectInternManager GetProjectById(string id);
        IEnumerable<ProjectInternManager> GetAllProjects();
        IEnumerable<ProjectInternManager> GetAllProjectsByStudentID(string id);
        string CreateProject(ProjectInternManager project);
        bool UpdateProject(string id, ProjectInternManager project);
        bool DeleteProject(string id);
    }
}
