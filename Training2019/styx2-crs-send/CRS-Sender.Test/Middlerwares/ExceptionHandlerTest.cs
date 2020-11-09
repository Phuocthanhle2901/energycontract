using Common.Exceptions;
using FluentAssertions;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Moq;
using RateLimit.Exception;
using styx2_crs_send.Core;
using styx2_crs_send.Midderwares;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CRS_Sender.Test.Middlerwares
{
    public class ExceptionHandlerTest
    {
        private readonly Mock<IConfiguration> mockConfig;
        private readonly Mock<ILogger> mockLogger;
        public ExceptionHandlerTest()
        {
            mockConfig = new Mock<IConfiguration>();
            mockLogger = new Mock<ILogger>();
        }

        #region HandleExceptionAsync
        [Fact]
        public async Task ExceptionHanderTest_ThrowsHttpStatusCode_HandleFailedException_BadRequestAsync()
        {
            var middleware = new ExceptionHandler((innerHttpContext) =>
            {
                throw new HandleFailedException(LoggingEnum.SCS0006);
            }, mockLogger.Object, mockConfig.Object);
            var context = new DefaultHttpContext();
            context.Response.Body = new MemoryStream();
            await middleware.Invoke(context);
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            context.Response.StatusCode.Should().Be((int)HttpStatusCode.BadRequest);
        }


        [Fact]
        public async Task ExceptionHanderTest_ThrowsHttpStatusCode_AlreadyExistingStatusException_BadRequestAsync()
        {
            var middleware = new ExceptionHandler((innerHttpContext) =>
            {
                throw new AlreadyExistingStatusException(LoggingEnum.SCS0006);
            }, mockLogger.Object, mockConfig.Object);
            var context = new DefaultHttpContext();
            context.Response.Body = new MemoryStream();
            await middleware.Invoke(context);
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            context.Response.StatusCode.Should().Be((int)HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task ExceptionHanderTest_ThrowsHttpStatusCode_OperationWithNoResultException_NoContentAsync()
        {
            var middleware = new ExceptionHandler((innerHttpContext) =>
            {
                throw new OperationWithNoResultException(LoggingEnum.SCS0006);
            }, mockLogger.Object, mockConfig.Object);
            var context = new DefaultHttpContext();
            context.Response.Body = new MemoryStream();
            await middleware.Invoke(context);
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            context.Response.StatusCode.Should().Be((int)HttpStatusCode.NoContent);
        }


        [Fact]
        public async Task ExceptionHanderTest_ThrowsHttpStatusCode_IllegalDataInTaskException_LockedAsync()
        {
            var middleware = new ExceptionHandler((innerHttpContext) =>
            {
                throw new IllegalDataInTaskException(LoggingEnum.SCS0006);
            }, mockLogger.Object, mockConfig.Object);
            var context = new DefaultHttpContext();
            context.Response.Body = new MemoryStream();
            await middleware.Invoke(context);
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            context.Response.StatusCode.Should().Be((int)HttpStatusCode.Locked);
        }

        [Fact]
        public async Task ExceptionHanderTest_ThrowsHttpStatusCode_LimitException_LockedAsync()
        {
            var middleware = new ExceptionHandler((innerHttpContext) =>
            {
                throw new LimitException(LoggingEnum.SCS0006);
            }, mockLogger.Object, mockConfig.Object);
            var context = new DefaultHttpContext();
            context.Response.Body = new MemoryStream();
            await middleware.Invoke(context);
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            context.Response.StatusCode.Should().Be((int)HttpStatusCode.TooManyRequests);
        }

        [Fact]
        public async Task ExceptionHanderTest_ThrowsHttpStatusCode_WcfFailedCommunicationException_LockedAsync()
        {
            var middleware = new ExceptionHandler((innerHttpContext) =>
            {
                throw new WcfFailedCommunicationException(LoggingEnum.SCS0006);
            }, mockLogger.Object, mockConfig.Object);
            var context = new DefaultHttpContext();
            context.Response.Body = new MemoryStream();
            await middleware.Invoke(context);
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            context.Response.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }

        [Fact]
        public async Task ExceptionHanderTest_ThrowsHttpStatusCode_Default_InternalServerErrorAsync()
        {
            var middleware = new ExceptionHandler((innerHttpContext) =>
            {
                throw new Exception();
            }, mockLogger.Object, mockConfig.Object);
            var context = new DefaultHttpContext();
            context.Response.Body = new MemoryStream();
            await middleware.Invoke(context);
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            context.Response.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
        #endregion
    }
}
