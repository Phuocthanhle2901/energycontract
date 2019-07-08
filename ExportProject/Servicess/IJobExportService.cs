using Entites.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services
{

    public interface IJobExportService
    {
        string ExportToCSVFile(IEnumerable<Stores> list);

    }
}
