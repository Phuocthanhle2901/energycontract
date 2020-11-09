using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Main
{
    public class Huurder
    {
        public Huurder()
        {
            HuurderOrder = new HashSet<HuurderOrder>();
        }

        public int Id { get; set; }
        public string HeaderId { get; set; }
        public string HeaderSystemId { get; set; }

        public ICollection<HuurderOrder> HuurderOrder { get; set; }
    }
}
