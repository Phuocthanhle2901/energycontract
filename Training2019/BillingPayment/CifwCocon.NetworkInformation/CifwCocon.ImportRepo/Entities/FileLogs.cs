using CifwCocon.ImportRepo.Base;

namespace CifwCocon.ImportRepo.Entities
{
    public class FileLogs : Entity
    {
        public string Name { get; set; }
        public bool IsImported { get; set; }
    }
}
