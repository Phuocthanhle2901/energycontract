using System;
using System.Collections.Generic;

namespace Entites.Models
{
    public partial class Stores
    {
        public int StoreId { get; set; }
        public string StoreName { get; set; }
        public string Phone { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}
