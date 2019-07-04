using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace QLThucTap_INFOdation.BusinessLogic.IService
{
    public interface ITrainingManagerManagementService
    {
        TrainingManager GetTrainingManagerById(string id);
        IEnumerable<TrainingManager> GetAllTrainingManagers();
        string CreateTrainingManager(TrainingManager project);
        bool UpdateTrainingManager(string id, TrainingManager project);
        bool DeleteTrainingManager(string id);
    }
}
