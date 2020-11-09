using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel
{
    public class ResponseUnroutedOrders
    {
        public int pageSize { get; set; }
        public int totalItem { get; set; }
        public int totalPage { get; set; }
        public List<UnroutedOrderModel> listItem { get; set; }                                         
    }
}
