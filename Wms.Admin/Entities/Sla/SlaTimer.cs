using System.Collections.Generic;

namespace Entities.Sla
{
    public partial class SlaTimer
    {
        public SlaTimer()
        {
            BreachCalculation = new HashSet<BreachCalculation>();
        }

        public int Id { get; set; }
        public string WarningId { get; set; }
        public string BreachId { get; set; }

        public virtual ICollection<BreachCalculation> BreachCalculation { get; set; }
    }
}
