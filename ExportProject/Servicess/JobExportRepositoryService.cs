using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CsvHelper;
using System.IO;
using UnitOfWorks;
using Entites.Models;

//using Entites.Models;
namespace Services
{
    public class JobExportRepositoryService : IJobExportService
    {
        private readonly exportprojectContext db = new exportprojectContext();
        private readonly JobExportUnitRepository jobExportUnitRepository = new JobExportUnitRepository();
        //public JobExportRepositoryService()
        //{

        //}
        public string ExportToCSVFile(IEnumerable<Stores> list)
        {
            var root = Directory.GetCurrentDirectory();
            using (var writer = new StreamWriter(root + "\\FileCSV572019.csv"))
            {
                using (var csv = new CsvWriter(writer))
                {
                    csv.WriteRecords(list);
                    writer.Flush();
                }
            }
            return root + "\\FileCSV572019.csv";
        }
    }
}


