using System;
using System.IO;
using System.Net;
using System.Text;
using System.Xml;

namespace SendingRawSOAPRequest
{
    class Program
    {

        static void Main(string[] args)
        {
            var xmlUltis = new XmlUltils();
            xmlUltis.SearchFistSixty("styx", "60");
            Console.ReadKey();
        }
    }
}
