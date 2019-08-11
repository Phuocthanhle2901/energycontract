using static DomainModel.Enum.OrderSlaEnum;

namespace Entities.Sla
{
    public partial class RulePrimitivedataConditions
    {
        public int Id { get; set; }
        public string FieldName { get; set; }
        public string Value { get; set; }
        public sbyte? IsNullIgnore { get; set; }
        public string MappingClass { get; set; }
        public string MappingNamespace { get; set; }
        public string MappingPackage { get; set; }
        public string Version { get; set; }
        public int SlaRuleId { get; set; }
        public DataTypeRule DataType { get; set; }

        public virtual Rule SlaRule { get; set; }
    }
}
