using System;
using System.Collections.Generic;
using static DomainModel.Enum.OrderSlaEnum;

namespace Entities.Sla
{
    public partial class Rule
    {
        public Rule()
        {
            BreachCalculation = new HashSet<BreachCalculation>();
            RuleCalculationObjects = new HashSet<RuleCalculationObjects>();
            RulePrimitivedataConditions = new HashSet<RulePrimitivedataConditions>();
        }

        public int Id { get; set; }
        public string RuleName { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public int ThresHold { get; set; }
        public int Calendar { get; set; }
        public int Rule_nr { get; set; }
        public string PartyName { get; set; }
        public string PartySystem { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public RuleType RuleType { get; set; }
        public Priority? Priority { get; set; }
        public Domain Domain { get; set; }
        public NetworkType? NetworkType { get; set; }
        public SlaDirection SlaDirection { get; set; }
        public MeasurementUnit MeasureUnit { get; set; }


        public virtual Calendar CalendarNavigation { get; set; }
        public virtual ICollection<BreachCalculation> BreachCalculation { get; set; }
        public virtual ICollection<RuleCalculationObjects> RuleCalculationObjects { get; set; }
        public virtual ICollection<RulePrimitivedataConditions> RulePrimitivedataConditions { get; set; }
    }
}
