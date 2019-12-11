using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Main
{
    public class CustomerLocation
    {
        public CustomerLocation()
        {
            Connection = new HashSet<Connection>();
        }

        public int Id { get; set; }
        public string SearchCode { get; set; }
        public string ZipCode { get; set; }
        public int HouseNumber { get; set; }
        public string HouseNumberExtension { get; set; }
        public string Room { get; set; }
        

        public ICollection<Connection> Connection { get; set; }
    }
}
