using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel
{
   public class ResponseSlaRuleOrder
    {
        public int pageSize { get; set; }
        public int totalItem { get; set; }
        public int totalPage { get; set; }
        public List<SlaRule> listItem { get; set; }
    }
}
