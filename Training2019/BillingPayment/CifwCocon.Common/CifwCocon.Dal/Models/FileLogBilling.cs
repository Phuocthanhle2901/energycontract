
using System;
using System.ComponentModel.DataAnnotations;

namespace CifwCocon.ImportRepo.Entities
{
    public class FileLogBilling
    {
        [Key]
        public int id { get; set; }
        public string FileName { get; set; }
        public string RecordsInFile { get; set; }
        public bool IsImport { get; set; } = false;
        public string RecordsCreatedInDatabase { get; set; }
        public string RecordsUpdatedInDatabase { get; set; }
        public string AddressesUpdatedInCocon { get; set; }
        public string ErrorsWritingDataToCocon { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}