using Entites.Models;
using System.Collections.Generic;

namespace Services
{

    public interface IJobExportService
    {
        string ExportToCSVFile(IEnumerable<ViewExport> list,string fileName);

    }
}
