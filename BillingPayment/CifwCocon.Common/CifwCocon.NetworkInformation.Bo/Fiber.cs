using Newtonsoft.Json;

namespace CifwCocon.NetworkInformation.Bo
{
    public class Fiber
    {
        public string PopShelf { get; set; }
        public string Closet { get; set; }
        public string Row { get; set; }
        public string LocationName { get; set; }
        public string Position { get; set; }
        public string PatchStatus { get; set; }
        public string Port { get; set; }     
        public string Frame { get; set; }
        public string ActiveOperator { get; set; }       
        public string ActiveOperatorOrderId { get; set; }
        public string ActiveOrderTypePlanned { get; set; }
        public string ActiveOperatorPlanned { get; set; }
        public string ActiveOperatorOrderIdPlanned { get; set; }
        public int? FiberType { get; set; }

        [JsonIgnore]
        public bool IsNull
        {
            get
            {
                return !FiberType.HasValue && string.IsNullOrWhiteSpace(PopShelf) && string.IsNullOrWhiteSpace(Closet) &&
                   string.IsNullOrWhiteSpace(Row) && string.IsNullOrWhiteSpace(LocationName) && string.IsNullOrWhiteSpace(Position) &&
                   string.IsNullOrWhiteSpace(PatchStatus) && string.IsNullOrWhiteSpace(Port) && string.IsNullOrWhiteSpace(Frame) && 
                   string.IsNullOrWhiteSpace(ActiveOperator) && string.IsNullOrWhiteSpace(ActiveOrderTypePlanned);
            }
        }       
    }
}
