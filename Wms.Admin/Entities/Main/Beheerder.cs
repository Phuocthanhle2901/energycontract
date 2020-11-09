using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Main
{
    public class Beheerder
    {
        public Beheerder()
        {
            BeheerderOrder = new HashSet<BeheerderOrder>();
        }

        public int Id { get; set; }
        public string HeaderId { get; set; }
        public string HeaderSystemId { get; set; }

        public ICollection<BeheerderOrder> BeheerderOrder { get; set; }
    }
}
