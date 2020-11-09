using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CifwCocon.ImportRepo.Entities
{
    public class Configuration
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Key { get; set; }
        public string Value { get; set; }
        public string Environment { get; set; }
        public string Description { get; set; }
    }
}
