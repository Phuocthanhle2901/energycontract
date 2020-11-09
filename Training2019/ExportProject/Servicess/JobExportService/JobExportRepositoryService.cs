using CsvHelper;
using Entites.Models;
using System.Collections.Generic;
using System.IO;
using UnitOfWorks;
namespace Services
{
    public class JobExportRepositoryService : IJobExportService
    {
        ReadFileJson json = new ReadFileJson();
        private readonly ExportProjectContext db = new ExportProjectContext();
        private readonly JobExportUnitRepository jobExportUnitRepository = new JobExportUnitRepository();
     
        public string ExportToCSVFile(IEnumerable<ViewExport> list,string fileName)
        {
            var root = Directory.GetCurrentDirectory();
            using (var writer = new StreamWriter(root + "\\"+ fileName + json.format))
            {
                using (var csv = new CsvWriter(writer))
                {
                    csv.WriteRecords(list);
                    writer.Flush();
                }
            }
            return root + "\\" + fileName + json.format;
        }
    }
}


