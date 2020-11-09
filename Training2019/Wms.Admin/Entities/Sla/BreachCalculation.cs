using System;

namespace Entities.Sla
{
    public class BreachCalculation
    {
        public long Id { get; set; }
        public int RuleId { get; set; }
        public int CalculationObjectId { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? StartHold { get; set; }
        public DateTime? EndHold { get; set; }
        public int? DurationHold { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? SlaTimerId { get; set; }
        public sbyte? IsSync { get; set; }

        public virtual CalculationObject CalculationObject { get; set; }
        public virtual Rule Rule { get; set; }
        public virtual SlaTimer SlaTimer { get; set; }
    }
}
