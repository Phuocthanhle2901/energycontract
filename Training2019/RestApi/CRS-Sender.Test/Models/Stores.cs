using System;
using System.Collections.Generic;

namespace Entites.Models
{
    public partial class Stores
    {
        public int Storeid { get; set; }
        public string Storename { get; set; }
        public string Phone { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zipcode { get; set; }
        public int EmployeeId { get; set; }
    }
}
