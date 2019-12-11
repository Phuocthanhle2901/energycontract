using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Repository.Models
{
    public partial class StudentCV : IValidatableObject
    {
        public int ID { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        [StringLength(15)]
        public string StudentID { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        [StringLength(100)]
        public string StudentName { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        [StringLength(254)]        
        public string Email { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        [Display(Name = "How you know us?")]
        public int KnowUsID { get; set; }

        [Display(Name ="Framework use?")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        [StringLength(50)]
        public string FrameworkUse { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        public string Problem { get; set; }

        [Display(Name = "Example of a project single")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        public string ExAppAlone { get; set; }

        [Display(Name = "Favorite programming language")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        public string SpecializeID { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        public string Intro { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        [Display(Name = "Expected Location")]
        public int ExpectedLocationID { get; set; }

        [Column(TypeName = "date")]
        [Display(Name = "Intern startdate")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime InternStartDate { get; set; }

        [Display(Name = "Example of a project team")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Không được bỏ trống!")]
        public string ExAppTeam { get; set; }
        [Required]
        public string Status { get; set; }
        //public bool Status { get; set; }
        //[Column(TypeName = "date")]
        [Display(Name = "Interview Schedule")]
        //[DataType(DataType.DateTime)]
        //[DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime InterviewSchedule { get; set; }

        [Required]
        public string Gender { get; set; }

        public virtual ExpectedLocation ExpectedLocation { get; set; }        
        public virtual KnowU KnowU { get; set; }        
        public virtual Specialize Specialize { get; set; }
        [NotMapped]
        public List<KnowU> KnowUCollection { get; set; }
        [NotMapped]
        public List<ExpectedLocation> ExpectedCollection { get; set; }
        [NotMapped]
        public List<Specialize> SpecializeCollection { get; set; }
        IEnumerable<ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {
            if (InternStartDate < DateTime.Today)
            {
                yield return new ValidationResult("Ngày bắt đầu thực tập không được trước ngày hôm nay");
            }
            if (InterviewSchedule < DateTime.Today)
            {
                yield return new ValidationResult("Ngày hẹn phỏng vấn không được trước ngày hôm nay");
            }
        }
    }
}
