using IFD.Logging;
using Microsoft.Extensions.Configuration;
using SendingRawSOAPRequest.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace SendingRawSOAPRequest
{
    class TicketRequest
    {
        readonly IConfiguration config;
        readonly ILogger logger;
        SearchFirstSixtyRequest requestInfo;
        public TicketRequest(IConfiguration config,ILogger logger)
        {
            this.logger = logger;
            this.config = config;
            requestInfo = new SearchFirstSixtyRequest();
            SetRequestInfo();
        }

        void SetRequestInfo()
        {
            requestInfo.ServiceEndPoint = config["requestInfo:serviceEndPoint"];
            requestInfo.Header = config["requestInfo:header"];
            requestInfo.ContentType = config["requestInfo:contentType"];
            requestInfo.Accept = config["requestInfo:accept"];
            requestInfo.Method = config["requestInfo:method"];
        }

        void SetSearchFirstSixtyInfo(string ticket_Group,string aantal)
        {
            requestInfo.XsiNameSpace = config["xmlNameSpace:xsi"];
            requestInfo.XsdNameSpace = config["xmlNameSpace:xsd"];
            requestInfo.SoapEnvNameSpace = config["xmlNameSpace:soapenv"];
            requestInfo.UrnNameSpace = config["xmlNameSpace:urn"];
            requestInfo.encodingStyle = config["encodingStyle"];
            requestInfo.Ticket_Group = ticket_Group;
            requestInfo.Aantal = aantal;
        }
        private  HttpWebRequest CreateWebRequest()
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(requestInfo.ServiceEndPoint);
            webRequest. Headers.Add(requestInfo.Header);
            webRequest.ContentType = requestInfo.ContentType; ;
            webRequest.Accept = requestInfo.Accept;
            webRequest.Method = requestInfo.Method;
            return webRequest;
        }

        private string CreateRawXmlSOAPRequest()
        {
                XNamespace xsi = requestInfo.XsiNameSpace;
                XNamespace xsd = requestInfo.XsdNameSpace;
                XNamespace soapenv = requestInfo.SoapEnvNameSpace;
                XNamespace urn = requestInfo.UrnNameSpace;
                XElement[] elements = new XElement[]{
                new XElement("Ticket_Group",new XAttribute(xsi+"type","xsd:string"),requestInfo.Ticket_Group),
                new XElement("Aantal", new XAttribute(xsi + "type", "xsd:int"), requestInfo.Aantal)
                };
                XElement Envelope = new XElement(soapenv + "Envelope",
                                    new XAttribute(XNamespace.Xmlns + "xsi", xsi.NamespaceName),
                                    new XAttribute(XNamespace.Xmlns + "xsd", xsd.NamespaceName),
                                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv.NamespaceName),
                                    new XAttribute(XNamespace.Xmlns + "urn", urn.NamespaceName),
                                        new XElement(soapenv + "Header"),
                                        new XElement(soapenv + "Body",
                                                new XElement(urn + "searchFirstSixty",
                                                new XAttribute(soapenv + "encodingStyle", requestInfo.encodingStyle),
                                                elements
                                                )
                                        )
                                    );
                return Envelope.ToString();
        }

        public void SearchFistSixty(string ticket_Group, string aantal)
        {
            try
            {
                SetSearchFirstSixtyInfo(ticket_Group, aantal);
                HttpWebRequest request = CreateWebRequest();
                string xml = CreateRawXmlSOAPRequest();
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
            catch (Exception ex)
            {
                logger.Error("Fail to get data from SearchFirstSixty SOAP service. Details: "+ ex.GetType().ToString()+", message: " + ex.Message);
            }
        }   
    }
}
