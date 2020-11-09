using System.ComponentModel.DataAnnotations;
using static Cifw.Core.Enums.CoconEnum;

namespace CifwCocon.NetworkInformation.Bo
{
    public class ReadEntityRequestBo
    {
        [Required]
        [RegularExpression(@"[1-9][0-9]{3}[A-Za-z]{2}", ErrorMessage = "Invalid ZipCode")]
        public string Zipcode { get; set; }

        [Required]
        [Range(1, 99999, ErrorMessage = "Invalid HouseNumber between 1 to 99999")]
        public int HouseNumber { get; set; }

        [MaxLength(10, ErrorMessage = "Invalid HousenumberExtension (Maxlength = 10)")]
        public string HouseNumberSuffix { get; set; }

        [MaxLength(64, ErrorMessage = "Invalid Room (Maxlength = 64)")]
        public string Room { get; set; }

        [RegularExpression(@"^(FIBER_A|FIBER_B)$", ErrorMessage = "Only FIBER_A or FIBER_B")]
        public FiberEnum? FiberCode { get; set; }
    }
}
