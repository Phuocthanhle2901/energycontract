using System;
using System.Collections.Generic;
using System.Text;
using static EntitiesEnum.OrderContextConstants;

namespace Entities.Main
{
    public class Connection
    {
        public Connection()
        {
            BeheerderOrder = new HashSet<BeheerderOrder>();
            HuurderOrder = new HashSet<HuurderOrder>();
        }

        public int Id { get; set; }
        public NetworkType? NetworkType { get; set; }
        public FiberCode? FiberCode { get; set; }

        public int? CustomerLocationId { get; set; }
        public CustomerLocation CustomerLocation { get; set; }
        public ICollection<BeheerderOrder> BeheerderOrder { get; set; }
        public ICollection<HuurderOrder> HuurderOrder { get; set; }
    }
}
