using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface ITrainingProgramManagementService
    {
        TrainingProgram GetTrainingProgramById(string id);
        IEnumerable<TrainingProgram> GetAllTrainingPrograms();
        string CreateTrainingProgram(TrainingProgram project);
        bool UpdateTrainingProgram(string id, TrainingProgram project);
        bool DeleteTrainingProgram(string id);
    }
}
