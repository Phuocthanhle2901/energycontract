using Microsoft.Extensions.Configuration;
using SendingRawSOAPRequest.Models;
using System.Net;

namespace SendingRawSOAPRequest.Services
{
    public static class TicketRequestUltis
    {
        /// <summary>
        /// get requestInfo object in which have fully properties from appsetting.json to create a HTTPWebRequest
        /// </summary>
        /// <param name="config"></param>
        /// <returns></returns>
        public static WebRequestInfo GetRequestInfo(IConfiguration config)
        {
            var requestInfo = new WebRequestInfo();
            requestInfo.ServiceEndPoint = config["requestInfo:serviceEndPoint"];
            requestInfo.Header = config["requestInfo:header"];
            requestInfo.ContentType = config["requestInfo:contentType"];
            requestInfo.Accept = config["requestInfo:accept"];
            requestInfo.Method = config["requestInfo:method"];
            return requestInfo;
        }
        /// <summary>
        /// get NamespaceInfo object in which have fully properties from appsetting.json about namespace to working with raw request string
        /// </summary>
        /// <param name="config"></param>
        /// <returns></returns>
        public static NamespaceInfo GetNamespaceInfo(IConfiguration config)
        {
            NamespaceInfo namespaceInfo = new NamespaceInfo();
            namespaceInfo.XsiNameSpace = config["xmlNameSpace:xsi"];
            namespaceInfo.XsdNameSpace = config["xmlNameSpace:xsd"];
            namespaceInfo.SoapEnvNameSpace = config["xmlNameSpace:soapenv"];
            namespaceInfo.UrnNameSpace = config["xmlNameSpace:urn"];
            namespaceInfo.encodingStyle = config["encodingStyle"];
            return namespaceInfo;
        }
        /// <summary>
        ///  create a HttpWebRequest by the infomations got from GetRequestInfo() method
        /// </summary>
        public static HttpWebRequest CreateWebRequest(IConfiguration config)
        {
            WebRequestInfo requestInfo= GetRequestInfo(config);
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(requestInfo.ServiceEndPoint);
            webRequest.Headers.Add(requestInfo.Header);
            webRequest.ContentType = requestInfo.ContentType; ;
            webRequest.Accept = requestInfo.Accept;
            webRequest.Method = requestInfo.Method;
            return webRequest;
        }
    }
}
