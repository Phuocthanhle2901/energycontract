using System.Linq;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Wms.Admin.Api.Attributes;

namespace Wms.Admin.Api.Middlewares
{
    public class Filter : IActionFilter
    {
        private readonly ILogger _logger;

        public Filter(ILogger logger)
        {
            _logger = logger;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var descriptor = context.ActionDescriptor as ControllerActionDescriptor;
            var methodInfo = descriptor?.MethodInfo;
            var filterAcceptable = methodInfo?.CustomAttributes.Where(s => s.AttributeType == typeof(FilterAcceptable));
            if (filterAcceptable != null && filterAcceptable.Any())
            {
                if (!context.ModelState.IsValid)
                {
                    var error = context.ModelState.Values.SelectMany(m => m.Errors).Select(e => e.ErrorMessage).FirstOrDefault();
                    context.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                    context.HttpContext.Response.Headers.Clear();
                    context.Result = new JsonResult(new { error });
                }
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception is null)
            {
                _logger.ResetAdditionalCorrelations();
            }
        }
    }
}
