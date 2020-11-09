using Entites.Models;
using System.Collections.Generic;

namespace UnitOfWorks
{

    public interface IJobExportUnit
    {
        IEnumerable<ViewExport> LoadAllData();
        void Dispose();
    }
}
