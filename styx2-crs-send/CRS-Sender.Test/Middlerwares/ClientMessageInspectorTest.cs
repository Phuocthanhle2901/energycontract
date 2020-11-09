using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Moq;
using styx2_crs_send.Midderwares;
using System;
using System.Collections.Generic;
using System.ServiceModel.Channels;
using System.Text;
using Xunit;

namespace CRS_Sender.Test.Middlerwares
{
    public class ClientMessageInspectorTest
    {
        private readonly Mock<IConfiguration> mockConfig;
        private Mock<Log4NetAdapter> mockLogger;
        private ClientMessageInspector ClientMessageInspector;

        public ClientMessageInspectorTest()
        {
            mockConfig = new Mock<IConfiguration>();
            mockLogger = new Mock<Log4NetAdapter>();

            ClientMessageInspector = new ClientMessageInspector(mockConfig.Object, mockLogger.Object);
        }

        [Fact]
        public void BeforeSendRequest_ReturnNotNullProperties()
        {
            var request = Message.CreateMessage(MessageVersion.Soap12WSAddressing10, "test");

            var result = ClientMessageInspector.BeforeSendRequest(ref request, null);

            Assert.NotNull(request.Properties.Values);
        }
    }
}
