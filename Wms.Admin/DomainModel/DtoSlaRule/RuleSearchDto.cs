using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.DtoSlaRule
{
    public class RuleSearchDto
    {
        public string Organisatie { get; set; }
        public string OrderType { get; set; }
        public string Sla { get; set; }
        public string ConnectionStatus { get; set; }
        public string BuildingStatus { get; set; }
        public string Priority { get; set; }
        public string NlType { get; set; }
        public DateTime? Startdatum { get; set; }
    }
}
