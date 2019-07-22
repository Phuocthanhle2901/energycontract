using System;
using System.Collections.Generic;
using System.Text;

namespace SendingRawSOAPRequest.Models
{
    class SearchFirstSixtyRequest : WebRequestInfo
    {
        public string XsiNameSpace { get; set; }
        public string XsdNameSpace { get; set; }
        public string SoapEnvNameSpace { get; set; }
        public string UrnNameSpace { get; set; }
        public string Ticket_Group { get; set; }
        public string Aantal { get; set; }
        public string encodingStyle { get; set; }
    }
}
