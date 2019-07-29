using CRSReference;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using SendingRawSOAPRequest.Models;
using SendingRawSOAPRequest.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace SendingRawSOAPRequest
{
    interface ISearchFirstSixtyService
    {
        void SearchFirstSixty(string Ticket_group, string Aantal);
        string CreateRawXmlSOAPRequest(string Ticket_group, string Aantal);
    }
    class SearchFirstSixtySerivce : TicketRequestBase,ISearchFirstSixtyService
    {
        public SearchFirstSixtySerivce(IConfiguration config,ILogger logger)
            :base(config, logger)
        {
        }
        // create a raw xml Soap request using LinqToXML with namespaces info and encodingStyle from model
        public string CreateRawXmlSOAPRequest(string ticket_Group,string aantal)
        {
                XNamespace xsi = namespaceInfo.XsiNameSpace;
                XNamespace xsd = namespaceInfo.XsdNameSpace;
                XNamespace soapenv = namespaceInfo.SoapEnvNameSpace;
                XNamespace urn = namespaceInfo.UrnNameSpace;
                XElement[] elements = new XElement[]{
                new XElement("Ticket_Group",new XAttribute(xsi+"type",xsd+"string"),ticket_Group),
                new XElement("Aantal", new XAttribute(xsi + "type",xsd+ "int"), aantal)
                };
                XElement Envelope = new XElement(soapenv + "Envelope",
                                    new XAttribute(XNamespace.Xmlns + "xsi", xsi.NamespaceName),
                                    new XAttribute(XNamespace.Xmlns + "xsd", xsd.NamespaceName),
                                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv.NamespaceName),
                                    new XAttribute(XNamespace.Xmlns + "urn", urn.NamespaceName),
                                        new XElement(soapenv + "Header"),
                                        new XElement(soapenv + "Body",
                                                new XElement(urn + "searchFirstSixty",
                                                new XAttribute(soapenv + "encodingStyle", namespaceInfo.encodingStyle),
                                                elements
                                                )
                                        )
                                    );
                return Envelope.ToString();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ticket_Group"></param>
        /// <param name="aantal"></param>
        public void SearchFirstSixty(string ticket_Group, string aantal)
        {
            try
            {
                string xml = CreateRawXmlSOAPRequest(ticket_Group,aantal);
                XmlDocument soapEnvelopeXml = new XmlDocument();             
                //load xml string to xml doccument object
                soapEnvelopeXml.LoadXml(xml);

                using ( Stream stream = base.request.GetRequestStream())
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
                        XmlNodeList nodeList = xmlResponse.GetElementsByTagName("NS2:TsearchOneResult");
                        List<TsearchOneResult> result= DeserializeNodesTsearchOne(nodeList);
 
                    }
                }
                logger.Info("Get data from SearchFirstSixty successfully");
            }
            catch (Exception ex)
            {
                logger.Error("Fail to get data from SearchFirstSixty SOAP service. Details: "+ ex.GetType().ToString()+", message: " + ex.Message);
            }
        }
        //this method cut the prefix NS2 out of xml string, then deserial it
        private List<TsearchOneResult> DeserializeNodesTsearchOne(XmlNodeList nodeList)
        {
            List<TsearchOneResult> list = new List<TsearchOneResult>();
            XmlRootAttribute xroot = new XmlRootAttribute();
            xroot.ElementName = "TsearchOneResult";
            xroot.Namespace = "urn:TicketServiceIntf";
            xroot.IsNullable = true;
            XmlSerializer deserializer = new XmlSerializer(typeof(TsearchOneResult), xroot);
            foreach (XmlNode item in nodeList)
            {
                string node = item.OuterXml;
                node = node.Replace("NS2:", "");
                node = node.Replace(":NS2", "");
                TextReader textReader = new StringReader(node);
                TsearchOneResult result = (TsearchOneResult)deserializer.Deserialize(textReader);
                list.Add(result);   
            }
            return list;
        }
    }
}
