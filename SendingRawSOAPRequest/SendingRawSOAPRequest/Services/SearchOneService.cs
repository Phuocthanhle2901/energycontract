using CRSReference;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace SendingRawSOAPRequest.Services
{
    interface ISearchOneService
    {
        void SearchOne(string Ticket_Nummer);
        string CreateRawXmlSOAPRequest(string ticket_number);
    }
    class SearchOneService : TicketRequestBase, ISearchOneService
    {
        public SearchOneService(IConfiguration config, ILogger logger)
            : base(config, logger) { }

        public string CreateRawXmlSOAPRequest(string ticket_nummer)
        {
            XNamespace xsi = namespaceInfo.XsiNameSpace;
            XNamespace xsd = namespaceInfo.XsdNameSpace;
            XNamespace soapenv = namespaceInfo.SoapEnvNameSpace;
            XNamespace urn = namespaceInfo.UrnNameSpace;
            XElement[] elements = new XElement[]{
                new XElement("Ticket_Nummer",new XAttribute(xsi+"type",xsd+"string"),ticket_nummer)
                };
            XElement Envelope = new XElement(soapenv + "Envelope",
                                new XAttribute(XNamespace.Xmlns + "xsi", xsi.NamespaceName),
                                new XAttribute(XNamespace.Xmlns + "xsd", xsd.NamespaceName),
                                new XAttribute(XNamespace.Xmlns + "soapenv", soapenv.NamespaceName),
                                new XAttribute(XNamespace.Xmlns + "urn", urn.NamespaceName),
                                    new XElement(soapenv + "Header"),
                                    new XElement(soapenv + "Body",
                                            new XElement(urn + "searchOne",
                                            new XAttribute(soapenv + "encodingStyle", namespaceInfo.encodingStyle),
                                            elements
                                            )
                                    )
                                );
            return Envelope.ToString();
        }

        public void SearchOne(string Ticket_Nummer)
        {
            try
            {
                string xml = CreateRawXmlSOAPRequest(Ticket_Nummer);
                XmlDocument soapEnvelopeXml = new XmlDocument();
                //load xml string to xml doccument object
                soapEnvelopeXml.LoadXml(xml);

                using (Stream stream = base.request.GetRequestStream())
                {
                    //save xml data in xmlDocument object into Request's tream
                    soapEnvelopeXml.Save(stream);
                }

                using (WebResponse response = base.request.GetResponse() /*null*/)
                {
                    // get response 
                    using (StreamReader rd = new StreamReader(/*"C:\\Users\\Admin\\Downloads\\CAIW2_CRS_Soap_Project\\CRS_Production_Format.xml"*/response.GetResponseStream()))
                    {
                        string soapResult = rd.ReadToEnd();
                        // then read data form response stream and write it to the console
                        XmlDocument xmlResponse = new XmlDocument();
                        List<TsearchOneResult> list = new List<TsearchOneResult>();
                        xmlResponse.LoadXml(soapResult);
                        XmlNodeList nodeList = xmlResponse.GetElementsByTagName("NS2:TNotitie");
                        TNotitie[] array = DeserializeNodesTNotitite(nodeList);
                        XmlNode node = xmlResponse.GetElementsByTagName("NS2:TsearchOneResult")[0];
                        TsearchOneResult result = DeserializeNodesTsearchOne(node);
                        result.Notities = array;

                    }
                }
                logger.Info("Get data from SearchFirstSixty successfully");
            }
            catch (Exception ex)
            {
                logger.Error("Fail to get data from SearchFirstSixty SOAP service. Details: " + ex.GetType().ToString() + ", message: " + ex.Message);
            }
        }
        //this method cut the prefix NS2 out of xml string, then deserial it
        private TsearchOneResult DeserializeNodesTsearchOne(XmlNode node)
        {
            XmlRootAttribute xroot = new XmlRootAttribute();
            xroot.ElementName = "TsearchOneResult";
            xroot.Namespace = "urn:TicketServiceIntf";
            xroot.IsNullable = true;
            XmlSerializer deserializer = new XmlSerializer(typeof(TsearchOneResult), xroot);

            string nodeXml = node.OuterXml;
            nodeXml = nodeXml.Replace("NS2:", "");
            nodeXml = nodeXml.Replace(":NS2", "");
            TextReader textReader = new StringReader(nodeXml);
            TsearchOneResult result = (TsearchOneResult)deserializer.Deserialize(textReader);

            return result;
        }
        //this method cut the prefix NS2 out of xml string, then deserial it
        private TNotitie[] DeserializeNodesTNotitite(XmlNodeList nodeList)
        {
            TNotitie[] array = new TNotitie[nodeList.Count];
            int i = 0;
            XmlRootAttribute xroot = new XmlRootAttribute();
            xroot.ElementName = "TNotitie";
            xroot.Namespace = "urn:TicketServiceIntf";
            xroot.IsNullable = true;
            XmlSerializer deserializer = new XmlSerializer(typeof(TNotitie), xroot);
            foreach (XmlNode item in nodeList)
            {
                string node = item.OuterXml;
                node = node.Replace("NS2:", "");
                node = node.Replace(":NS2", "");
                TextReader textReader = new StringReader(node);
                TNotitie result = (TNotitie)deserializer.Deserialize(textReader);
                array[i++] = result;
            }
            return array;
        }
    }
}
