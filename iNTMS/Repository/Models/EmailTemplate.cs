using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class EmailTemplate
    {
        public int id { get; set; }
        public string EmailFor { get; set; }
        public string Subject { get; set; }
        public string Body1 { get; set; }
        public string Body2 { get; set; }
        public string Body3 { get; set; }
        public string Body4  { get; set; }
    }
}
