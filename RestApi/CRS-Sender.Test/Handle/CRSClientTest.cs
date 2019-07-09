using CRS_Sender.Test.ModelsForTest;
using CRSReference;
using CRSTranformer;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Moq;
using styx2_crs_send.Handle;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRS_Sender.Test.Handle
{
    public class CRSClientTest
    {
        private readonly Mock<TicketService> mockTicketService;
        private readonly Mock<ITranformer> mockTranformer;
        private readonly Mock<ILogger> mockLogger;
        private readonly Mock<IConfiguration> mockConfiguration;
        private readonly Mock<ICheckRequest> mockCheckRequest;
        private readonly ICRSClient cRSClient;
        private readonly TaskModelTest taskModelTest;
        public CRSClientTest()
        {
            taskModelTest = new TaskModelTest();
            mockTicketService = new Mock<TicketService>();
            mockTranformer = new Mock<ITranformer>();
            mockConfiguration = new Mock<IConfiguration>();
            mockLogger = new Mock<ILogger>();
            mockCheckRequest = new Mock<ICheckRequest>();
            cRSClient = new CRSClient(mockTicketService.Object, 
                mockTranformer.Object, 
                mockLogger.Object, 
                mockConfiguration.Object, 
                mockCheckRequest.Object);
        }

        #region Search
        public void Search_ThrowsOperationWithNoResultException()
        {

        }
        #endregion
    }
}
