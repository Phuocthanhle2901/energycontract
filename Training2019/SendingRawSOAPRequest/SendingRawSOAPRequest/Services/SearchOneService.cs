using CRSReference;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using SendingRawSOAPRequest.Models;
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
        TsearchOneResult SearchOne(string Ticket_Nummer);
        string CreateRawXmlSOAPRequest(string ticket_number);
    }
    class SearchOneService : ISearchOneService
    {
        readonly ILogger logger;
        NamespaceInfo namespaceInfo;
        HttpWebRequest request;
        public SearchOneService(IConfiguration config, ILogger logger)
        {
            namespaceInfo = TicketRequestUltis.GetNamespaceInfo(config);
            request = TicketRequestUltis.CreateWebRequest(config);
            this.logger = logger;
        }
        /// <summary>
        /// Create a raw xml soap request string  using LinqToXML with the namespace config's info got from base class
        /// </summary>
        /// <param name="ticket_nummer"></param>
        /// <returns></returns>
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
        /// <summary>
        /// the main method call the SearchOne service and deserialize it to a TsearchResult object
        /// </summary>
        /// <param name="Ticket_Nummer"></param>
        public TsearchOneResult SearchOne(string Ticket_Nummer)
        {
            TsearchOneResult result = null;
            try
            {
                string xml = CreateRawXmlSOAPRequest(Ticket_Nummer);
                XmlDocument soapEnvelopeXml = new XmlDocument();
                //load xml string to xml doccument object
                soapEnvelopeXml.LoadXml(xml);

                using (Stream stream = request.GetRequestStream())
                {
                    //save xml data in xmlDocument object into Request's tream
                    soapEnvelopeXml.Save(stream);
                }

                using (WebResponse response = request.GetResponse())
                {
                    // get response 
                    using (StreamReader rd = new StreamReader(response.GetResponseStream()))
                    {
                        string soapResult = rd.ReadToEnd();
                        // then read data form response stream and write it to the console
                        XmlDocument xmlResponse = new XmlDocument();
                        List<TsearchOneResult> list = new List<TsearchOneResult>();
                        xmlResponse.LoadXml(soapResult);
                        //get TsearchOneResult object
                        XmlNode node = xmlResponse.GetElementsByTagName("NS2:TsearchOneResult")[0];
                        result = DeserializeNodesTsearchOne(node);
                        //get array of all Tnotitie in the response
                        XmlNodeList nodeList = xmlResponse.GetElementsByTagName("NS2:TNotitie");
                        TNotitie[] arrayTNotites = DeserializeNodesTNotitite(nodeList);
                        //add the array of the Tnotite to the notities property of TsearchOneResult 
                        result.Notities = arrayTNotites;

                    }
                }
                logger.Info("Get data from SearchFirstSixty successfully");
            }
            catch (Exception ex)
            {
                logger.Error("Fail to get data from SearchFirstSixty SOAP service. Details: " + ex.GetType().ToString() + ", message: " + ex.Message);
            }
            return result;
        }
        //this method cut the prefix NS2 out of xml string, then deserial it to TsearchOneResult object
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
        //this method cut the prefix NS2 out of xml string, then deserial it to a array of TNotitie instance
        private TNotitie[] DeserializeNodesTNotitite(XmlNodeList nodeList)
        {
            TNotitie[] arrayTNotites = new TNotitie[nodeList.Count];
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
                arrayTNotites[i++] = result;
            }
            return arrayTNotites;
        }
    }
}
