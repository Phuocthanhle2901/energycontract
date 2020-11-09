using Common.Exceptions;
using Common.Models;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using styx2_crs_send.Core;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace styx2_crs_send.Midderwares
{
    [ExcludeFromCodeCoverage]
    public class Filters : IActionFilter
    {
        private readonly ILogger _logger;
        private string _ticketRef;
        private string _actionName;
        public IConfiguration _configuration;
        public HttpClient _httpClient { get; set; }

        public Filters(ILogger logger, HttpClient httpClient, IConfiguration configuration)
        {
            _logger = logger;
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception is null)
            {
                _logger.LogException(LoggingEnum.SCS0002, message: $"End {_actionName} request.");
                _logger.ResetAdditionalCorrelations();
            }
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {

            SetAdditionalCorrelations(context);
            if (!context.ModelState.IsValid)
            {  
                var error = context.ModelState.Values.SelectMany(m => m.Errors).Select(e => e.ErrorMessage).FirstOrDefault();
                context.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                context.HttpContext.Response.Headers.Clear();
                var wrongResult = new { ticketRef = _ticketRef ?? string.Empty, result = new { code = CommonEnum.Default.ToString(), text = error } };
                context.Result = new JsonResult(wrongResult);
                _logger.LogException(LoggingEnum.SCS0006, message: error);
                return;
            }

        }

        private void SetAdditionalCorrelations(ActionExecutingContext context)
        {
            try
            {
                var objPassed = context.ActionArguments.Values.FirstOrDefault(s => s.GetType() != typeof(string) && s.GetType().IsClass);
                if (objPassed != null)
                {                    
                    _logger.SetMessageId(Guid.NewGuid().ToString());
                    _actionName = ((Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor)context.ActionDescriptor).ActionName;
                    _logger.LogException(LoggingEnum.SCS0001, message: $"Begin {_actionName} request.");

                    TaskModel TaskModel = (TaskModel) context.ActionArguments.Values.FirstOrDefault(s => s is TaskModel);
                    if(!string.IsNullOrWhiteSpace(TaskModel.TicketRef))
                    {
                        context.HttpContext.Request.Headers.Add("ticketRef", TaskModel.TicketRef);
                        _ticketRef = TaskModel.TicketRef;
                    }
                }
            }
            catch(NullReferenceException)
            {
                return;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
