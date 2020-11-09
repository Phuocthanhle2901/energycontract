namespace Entities.Sla
{
    public partial class RuleCalculationObjects
    {
        public int Id { get; set; }
        public int CalculationObjectId { get; set; }
        public int RuleId { get; set; }

        public virtual CalculationObject CalculationObject { get; set; }
        public virtual Rule Rule { get; set; }
    }
}
