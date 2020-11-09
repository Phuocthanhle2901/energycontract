using System;
using System.Collections.Generic;

namespace Entities.Main
{
    public class HuurderOrderHistory
    {
        public int Id { get; set; }
        public DateTime? EntryTime { get; set; }
        public ICollection<HuurderOrder> HuurderOrder { get; set; }
    }
}
