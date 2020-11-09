using CRS_Sender.Test.ModelsForTest;
using IFD.Logging;
using Microsoft.AspNetCore.Mvc;
using Moq;
using styx2_crs_send.Controllers;
using styx2_crs_send.Handle;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace CRS_Sender.Test.Controllers
{
    public class TaskControllerTest
    {
        private readonly TaskModelTest taskModelTest;
        private readonly Mock<ILogger> mockLogger;
        private readonly Mock<ICRSClient> mockCrsClient;
        public TaskControllerTest()
        {
            taskModelTest = new TaskModelTest();
            mockLogger = new Mock<ILogger>();
            mockCrsClient = new Mock<ICRSClient>();

        }
        [Fact]
        public void RestGatewayController_CheckRestGatewayController()
        {

            var RestGateway = new RestGatewayController(mockLogger.Object, mockCrsClient.Object);
            Assert.IsType<ObjectResult>(RestGateway.UpdateTaskByTicketRef(null, taskModelTest.GetTaskModelSuccessful()));
        }
        [Fact]
        public void RestGatewayController_CheckNullReferenceException()
        {

            var RestGateway = new RestGatewayController(null, null);
            Assert.Throws<NullReferenceException>(() => RestGateway.UpdateTaskByTicketRef());
        }
    }
}
