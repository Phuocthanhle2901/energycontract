using System;
using System.Collections.Generic;

namespace Entities.Sla
{
    public class CalculationObject
    {
        public CalculationObject()
        {
            BreachCalculation = new HashSet<BreachCalculation>();
            RuleCalculationObjects = new HashSet<RuleCalculationObjects>();
        }

        public int Id { get; set; }
        public long WmsId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdateDate { get; set; }

        public virtual ICollection<BreachCalculation> BreachCalculation { get; set; }
        public virtual ICollection<RuleCalculationObjects> RuleCalculationObjects { get; set; }
    }
}
