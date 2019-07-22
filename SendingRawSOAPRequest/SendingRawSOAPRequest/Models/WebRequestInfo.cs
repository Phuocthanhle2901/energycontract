using System;
using System.Collections.Generic;
using System.Text;

namespace SendingRawSOAPRequest.Models
{
    class WebRequestInfo
    {
        public string ServiceEndPoint { get; set; }
        public string Header { get; set; }
        public string ContentType { get; set; }
        public string Accept { get; set; }
        public string Method { get; set; }
    }
}
