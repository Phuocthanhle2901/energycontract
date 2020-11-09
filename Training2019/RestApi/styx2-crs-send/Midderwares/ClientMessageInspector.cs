using IFD.Logging;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Dispatcher;
using System.Threading.Tasks;

namespace styx2_crs_send.Midderwares
{
    public class ClientMessageInspector : IClientMessageInspector
    {
        public IConfiguration _configuration;
        public ILogger _logger;
        private string _serviceName;
        public ClientMessageInspector(IConfiguration configuration, ILogger logger)
        {
            _configuration = configuration;
            _logger = logger;
            _serviceName = _configuration["LoggerName"];
        }
        public void AfterReceiveReply(ref Message reply, object correlationState)
        {
            // log in_message
            _logger.Info($"{_serviceName} received message (IN_MESSAGE) -> \n {reply}");
        }

        public object BeforeSendRequest(ref Message request, IClientChannel channel)
        {
            // log out_message 
            _logger.Info($"{_serviceName} is sending message (OUT_MESSAGE) -> \n  {request}");

            HttpRequestMessageProperty property = new HttpRequestMessageProperty();
            property.Headers["Content-Type"] = "text/xml; charset=utf-8";
            property.Headers["User-Agent"] = "CRS-Sender";
            property.Headers["Connection"] = "Keep-Alive";
            property.Headers["Content-Length"] = $"{request.ToString().Length}";
            
            request.Properties.Add(HttpRequestMessageProperty.Name, property);

            return null;
        }
    }
}
