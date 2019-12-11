using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CifwCocon.ImportRepo.Base
{
    public interface IEntity
    {
        int Id { get; set; }
    }
    public abstract class Entity : IEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public System.DateTime DateCreated { get; set; }
        public System.DateTime? LastUpdated { get; set; }
        [NotMapped]
        public bool IsDelete { get; set; } = false;
        [NotMapped]
        public bool IsValid { get; set; } = true;
    }
}
