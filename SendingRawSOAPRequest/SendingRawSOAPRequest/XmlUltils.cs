using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace SendingRawSOAPRequest
{
    class XmlUltils
    {
        public  HttpWebRequest CreateWebRequest()
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(@"https://api-test.caiw.net/CRSservice/soap/TicketService");
            webRequest.Headers.Add(@"SOAP:Action");
            webRequest.ContentType = "text/xml;charset=\"utf-8\"";
            webRequest.Accept = "text/xml";
            webRequest.Method = "POST";
            return webRequest;
        }
        public void SearchFistSixty(string Ticket_Group, string Aantal)
        {
            HttpWebRequest request = CreateWebRequest();
            string xml = CreateRawXmlSOAPRequest(Ticket_Group, Aantal);
            XmlDocument soapEnvelopeXml = new XmlDocument();
            soapEnvelopeXml.LoadXml(xml);

            using (Stream stream = request.GetRequestStream())
            {
                soapEnvelopeXml.Save(stream);
            }

            using (WebResponse response = request.GetResponse())
            {
                using (StreamReader rd = new StreamReader(response.GetResponseStream()))
                {
                    string soapResult = rd.ReadToEnd();
                    Console.WriteLine(soapResult);
                }
            }
        }


        public string CreateRawXmlSOAPRequest(string Ticket_Group, string Aantal)
        {
            XNamespace xsi = "http://www.w3.org/2001/XMLSchema-instance";
            XNamespace xsd = "http://www.w3.org/2001/XMLSchema";
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace urn = "TicketServiceIntf-TicketService";
            XElement[] elements = new XElement[]{
                new XElement("Ticket_Group",new XAttribute(xsi+"type","xsd:string"),Ticket_Group),
                new XElement("Aantal", new XAttribute(xsi + "type", "xsd:int"), Aantal)
        };
            XElement Envelope = new XElement(soapenv + "Envelope",
                                new XAttribute(XNamespace.Xmlns + "xsi", xsi.NamespaceName),
                                new XAttribute(XNamespace.Xmlns + "xsd", xsd.NamespaceName),
                                new XAttribute(XNamespace.Xmlns + "soapenv", soapenv.NamespaceName),
                                new XAttribute(XNamespace.Xmlns + "urn", urn.NamespaceName),
                                    new XElement(soapenv+"Header"),
                                    new XElement(soapenv+"Body",
                                            new XElement(urn+"searchFirstSixty",
                                            new XAttribute(soapenv+"encodingStyle", "http://schemas.xmlsoap.org/soap/encoding/"),
                                            elements
                                            )
                                        )                                  
                                );
            return  Envelope.ToString();
        }
    }
}
