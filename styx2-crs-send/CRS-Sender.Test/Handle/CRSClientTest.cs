using Common.Exceptions;
using Common.Models;
using CRS_Sender.Test.ModelsForTest;
using CRSReference;
using CRSTranformer;
using CSRAdapter;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Moq;
using RateLimit.Exception;
using styx2_crs_send.Core;
using styx2_crs_send.Handle;
using System;
using System.Collections.Generic;
using System.IO;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CRS_Sender.Test.Handle
{
    public class CRSClientTest
    {
        private readonly Mock<TicketService> mockTicketService;
        private readonly Mock<ICRSAdapter> mockCrsclient;
        private readonly Mock<ITranformer> mockTranformer;
        private readonly Mock<ILogger> mockLogger;
        private readonly Mock<IConfiguration> mockConfiguration;
        private readonly Mock<ICheckRequest> mockCheckRequest;
        private readonly ICRSClient cRSClient;
        private readonly TaskModelTest taskModelTest;
        public CRSClientTest()
        {
            taskModelTest = new TaskModelTest();
            mockCrsclient = new Mock<ICRSAdapter>();
            mockTicketService = new Mock<TicketService>();
            mockTranformer = new Mock<ITranformer>();
            mockConfiguration = new Mock<IConfiguration>();
            mockLogger = new Mock<ILogger>();
            mockCheckRequest = new Mock<ICheckRequest>();

            mockConfiguration.Setup(s => s["ExceptionsAllowedBeforeBreaking"]).Returns("2");
            mockConfiguration.Setup(s => s["DurationOfBreak"]).Returns("2");
            mockConfiguration.Setup(s => s["RetryCount"]).Returns("2");

            cRSClient = new CRSClient(mockTicketService.Object, 
                mockTranformer.Object, 
                mockLogger.Object, 
                mockConfiguration.Object, 
                mockCheckRequest.Object,
                TestPolicyUtils.InitializeRetryAndCircuteBreaker(mockLogger.Object, mockConfiguration.Object),
                mockCrsclient.Object);
        }

        #region Search
        [Fact]
        public void Search_ThrowsOperationWithNoResultException_SearchOneAsynThrowFaultException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();

            Exception ex = new Exception("something to explain why this happen", new FaultException());
            mockTicketService.Setup(tk => tk.searchOneAsync(It.IsAny<searchOneRequest>()))
                                                                                    .Throws(ex);
            Assert.Throws<OperationWithNoResultException>(() => cRSClient.Search(taskModel));
        }
        [Fact]
        public void Search_ThrowsOperationWithResultException_searchOneAsyncThrowIOException()
        {
            mockTicketService.Setup(s => s.searchOneAsync(It.IsAny<searchOneRequest>())).Throws<IOException>();
            Assert.Throws<HandleFailedException>(() => cRSClient.Search(taskModelTest.GetTaskModelSuccessful()));
        }
        [Fact]
        public void Search_ThrowsOperationWithNoResultException_SearchOneAsynThrowAggregrateException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            mockTicketService.Setup(tk => tk.searchOneAsync(It.IsAny<searchOneRequest>()))
                                                                                    .Throws<AggregateException>();
            Assert.Throws<WcfFailedCommunicationException>(() => cRSClient.Search(taskModel));
        }
        [Fact]
        public void Search_ThrowsOperationWithNoResultException_SearchOneAsynThrowProtocolException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            mockTicketService.Setup(tk => tk.searchOneAsync(It.IsAny<searchOneRequest>()))
                                            .Throws(new ProtocolException("a message for protocol ex"));
            Assert.Throws<WcfFailedCommunicationException>(() => cRSClient.Search(taskModel));
        }
        [Fact]
        public void Search_ThrowsOperationWithNoResultException_SearchOneAsynReturnNull()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            searchOneResponse searchOneResponse = null;
            mockTicketService.Setup(s => s.searchOneAsync(It.IsAny<searchOneRequest>())).Returns(Task.FromResult(searchOneResponse));
            Assert.Throws<OperationWithNoResultException>(() => cRSClient.Search(taskModelTest.GetTaskModelSuccessful()));


            //searchOneResponse searchOne = null;
            //mockTicketService.Setup(tk => tk.searchOneAsync(It.IsAny<searchOneRequest>()))
            //                               .ReturnsAsync(searchOne);

            Assert.Throws<OperationWithNoResultException>(() => cRSClient.Search(taskModel));
        }
        [Fact]
        public void Search_ThrowsOperationWithNoResultException_SearchOneAsynReturnValueHasNoLenght()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            searchOneResponse searchOne = new searchOneResponse();
            searchOne.@return = new TsearchOneResult[] { };
            mockTicketService.Setup(tk => tk.searchOneAsync(It.IsAny<searchOneRequest>()))
                                           .ReturnsAsync(searchOne);
            Assert.Throws<OperationWithNoResultException>(() => cRSClient.Search(taskModel));
        }
        [Fact]
        public void Search_ReturnValue()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            searchOneResponse searchOneResponse = new searchOneResponse();
            searchOneResponse.@return = new TsearchOneResult[] { new TsearchOneResult() };
            mockTicketService.Setup(s => s.searchOneAsync(It.IsAny<searchOneRequest>())).Returns(Task.FromResult(searchOneResponse));
            Assert.IsType<searchOneResponse>(cRSClient.Search(taskModel));
        }

        [Theory]
        [InlineData("There is an error in XML document")]
        [InlineData("something else for exception message")]
        public void Search_ThrowsLimitException_SearchOneThrowInvalidOperationException(string message)
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            mockTicketService.Setup(tk => tk.searchOneAsync(It.IsAny<searchOneRequest>()))
                                           .Throws(new InvalidOperationException(message));
            Assert.Throws<LimitException>(() => cRSClient.Search(taskModel));
        }
        [Theory]
        [InlineData("There is an error in XML document")]
        [InlineData("something else for exception message")]
        public void Search_ThrowsLimitException_SearchOneThrowInnerInvalidOperationException(string message)
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            Exception ex = new Exception(message, new InvalidOperationException(message));
            mockTicketService.Setup(tk => tk.searchOneAsync(It.IsAny<searchOneRequest>()))
                                           .Throws(ex);
            Assert.Throws<LimitException>(() => cRSClient.Search(taskModel));
        }
        #endregion

        #region UpdateTicket
        [Fact]
        public void UpdateTicket_ThrowIllegalDataInTaskException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();

            TsearchOneResult tsearchOneResult = new TsearchOneResult();

            mockCrsclient.Setup(s => s.SearchOneTraditionalWay(It.IsAny<string>())).Returns(tsearchOneResult);
            updateOneResponse updateOne = new updateOneResponse();
            updateOne.@return = false;
            mockTicketService.Setup(s => s.updateOneAsync(It.IsAny<updateOneRequest>())).Returns(Task.FromResult(updateOne));

            Assert.Throws<IllegalDataInTaskException>(() => cRSClient.UpdateTicket(taskModel));
        }

        [Fact]
        public void UpdateTicket_ThrowHandleFailedException_CatchNullReferenceException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            TsearchOneResult tsearchOneResult = new TsearchOneResult();

            mockCrsclient.Setup(s => s.SearchOneTraditionalWay(It.IsAny<string>())).Returns(tsearchOneResult);

            Task<updateOneResponse> updateOne = null;
            mockTicketService.Setup(s => s.updateOneAsync(It.IsAny<updateOneRequest>())).Returns(updateOne);

            Assert.Throws<HandleFailedException>(() => cRSClient.UpdateTicket(taskModel));
        }

        [Fact]
        public void UpdateTicket_ThrowWcfFailedCommunicationException_CatchAggregateException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();

            TsearchOneResult tsearchOneResult = new TsearchOneResult();

            mockCrsclient.Setup(s => s.SearchOneTraditionalWay(It.IsAny<string>())).Returns(tsearchOneResult);
            mockTicketService.Setup(s => s.updateOneAsync(It.IsAny<updateOneRequest>())).Throws<AggregateException>();

            Assert.Throws<WcfFailedCommunicationException>(() => cRSClient.UpdateTicket(taskModel));
        }
        [Fact]
        public void UpdateTicket_ThrowWcfFailedCommunicationException_CatchProtocolException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();

            TsearchOneResult tsearchOneResult = new TsearchOneResult();

            mockCrsclient.Setup(s => s.SearchOneTraditionalWay(It.IsAny<string>())).Returns(tsearchOneResult);
            mockTicketService.Setup(s => s.updateOneAsync(It.IsAny<updateOneRequest>())).Throws(new ProtocolException("message for Protocol exception"));

            Assert.Throws<WcfFailedCommunicationException>(() => cRSClient.UpdateTicket(taskModel));
        }
        [Fact]
        public void UpdateTicket_ThrowHandleFailedException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();

            searchOneResponse searchOneResponse = new searchOneResponse();
            searchOneResponse.@return = new TsearchOneResult[] { new TsearchOneResult() };
            mockTicketService.Setup(s => s.searchOneAsync(It.IsAny<searchOneRequest>())).Returns(Task.FromResult(searchOneResponse));

            mockCheckRequest.Setup(cr => cr.CheckValue(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<string>>())).Throws(new HandleFailedException(LoggingEnum.SCS0002));

            Assert.Throws<HandleFailedException>(() => cRSClient.UpdateTicket(taskModel));
        }

        [Fact]
        public void UpdateTicket_ReturnValue()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            TsearchOneResult tsearchOneResult = new TsearchOneResult();

            mockCrsclient.Setup(s => s.SearchOneTraditionalWay(It.IsAny<string>())).Returns(tsearchOneResult);
            updateOneResponse updateOne = new updateOneResponse();
            updateOne.@return = true;
            mockTicketService.Setup(s => s.updateOneAsync(It.IsAny<updateOneRequest>())).Returns(Task.FromResult(updateOne));

            mockTranformer.Setup(tran => tran.TransformToCRS(It.IsAny<TaskModel>(), It.IsAny<TsearchOneResult>())).Returns(new updateOneRequest());

            Assert.IsType<ResultFn>(cRSClient.UpdateTicket(taskModel));
        }
        #endregion
    }
}
