using IFD.Logging;
using Microsoft.Extensions.Configuration;
using SendingRawSOAPRequest.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace SendingRawSOAPRequest.Services
{
    class TicketRequestBase 
    {
        protected readonly IConfiguration config;
        protected readonly ILogger logger;
        protected WebRequestInfo requestInfo;
        protected HttpWebRequest request;
        protected NamespaceInfo namespaceInfo;
        public TicketRequestBase(IConfiguration config, ILogger logger)
        {
            this.logger = logger;
            this.config = config;
            SetRequestInfo();
            request = CreateWebRequest();
            SetNamespaceInfo();
        }
        // get properties for WebRequest's info first, every request must have this. so it will be called in constructor
        void SetRequestInfo()
        {
            requestInfo = new WebRequestInfo();
            requestInfo.ServiceEndPoint = config["requestInfo:serviceEndPoint"];
            requestInfo.Header = config["requestInfo:header"];
            requestInfo.ContentType = config["requestInfo:contentType"];
            requestInfo.Accept = config["requestInfo:accept"];
            requestInfo.Method = config["requestInfo:method"];
        }
        // get details property to make a raw SOAP request for SearchFirstSixty requesting
        void SetNamespaceInfo()
        {
            namespaceInfo = new NamespaceInfo();
            namespaceInfo.XsiNameSpace = config["xmlNameSpace:xsi"];
            namespaceInfo.XsdNameSpace = config["xmlNameSpace:xsd"];
            namespaceInfo.SoapEnvNameSpace = config["xmlNameSpace:soapenv"];
            namespaceInfo.UrnNameSpace = config["xmlNameSpace:urn"];
            namespaceInfo.encodingStyle = config["encodingStyle"];
        }

        // add value to HttpWebRequest from the model which's already have fully properties from config
        private HttpWebRequest CreateWebRequest()
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(requestInfo.ServiceEndPoint);
            webRequest.Headers.Add(requestInfo.Header);
            webRequest.ContentType = requestInfo.ContentType; ;
            webRequest.Accept = requestInfo.Accept;
            webRequest.Method = requestInfo.Method;
            return webRequest;
        }
    }
}
