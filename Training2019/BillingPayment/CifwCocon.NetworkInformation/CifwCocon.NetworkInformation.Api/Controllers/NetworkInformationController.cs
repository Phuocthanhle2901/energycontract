using System;
using System.Net;
using Cifw.Core.Exceptions;
using IFD.Logging;
using CifwCocon.NetworkInformation.Api.Helpers;
using CifwCocon.NetworkInformation.Biz;
using CifwCocon.NetworkInformation.Bo;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq.Expressions;
using Cifw.Core;
using Cifw.Core.Enums;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Threading;

namespace CifwCocon.NetworkInformation.Api.Controllers
{
    [Route("api/[controller]")]
    public class NetworkInformationController : Controller
    {
        private ILogger _logger;
        private CoconNetworkBiz _coconNetWorkBiz;
        private WritePatchBiz _writePatchBiz;
        private CoconAddressBiz _coconAddressBiz;
        private readonly IInfrastructureOverrideService _infrastructureOverrideService;
        public NetworkInformationController(ILogger logger, CoconNetworkBiz coconNetWorkBiz, CoconAddressBiz coconAddressBiz, WritePatchBiz writePatchBiz, IInfrastructureOverrideService infrastructureOverrideService)
        {
            _logger = logger;
            _coconNetWorkBiz = coconNetWorkBiz;
            _coconAddressBiz = coconAddressBiz;
            _writePatchBiz = writePatchBiz;
            _infrastructureOverrideService = infrastructureOverrideService;
        }
        
        /// <summary>
        /// Get network information
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("clean")]
        public async Task<IActionResult> CleanNetworkInformation(ReadEntityRequestBo request)
        {
            try
            {
                var currentCorrelationId = _logger.GetCorrelationId();
                var messageId = _logger.GetMessageId();

                var tags = new Dictionary<string, string>()
                {
                    { "SearchCode", $"{@request.Zipcode}" +
                                    $"{@request.HouseNumber.ToString()}" +
                                    $"{@request.HouseNumberSuffix}" +
                                    $"{@request.Room}" },
                    { "FiberCode", request.FiberCode == Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A ? "FIBER_A" : request.FiberCode == Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_B ? "FIBER_B" : null },
                };

                _logger.SetAdditionalCorrelations(tags);

                _logger.LogException(NimFiberLoggingEnum.NFI0010);

                //Validation
                if (!ModelState.IsValid)
                {
                    _logger.LogException(NimFiberLoggingEnum.NFI0001);
                    var errorMessages = Helper.GetMessages(ModelState);
                    return BadRequest(errorMessages);
                }

                //Get network information
                _logger.LogException(NimFiberLoggingEnum.NFI0012);

                //Key: Override 
                //Value: Warning message

                _logger.SetAdditionalCorrelations(tags);
                _logger.SetMessageId(messageId);
                _logger.SetCorrelationId(currentCorrelationId);

                var overrideResult = await _infrastructureOverrideService.Get(request);
                var warningMessage = overrideResult.Value;
                CleanCoconResponse result = overrideResult.Key;

                _logger.SetAdditionalCorrelations(tags);
                _logger.SetMessageId(messageId);
                _logger.SetCorrelationId(currentCorrelationId);

                //Switch to
                //--LocalCache
                //--Cocon
                if (overrideResult.Key == null)
                {
                    var coconResult = _coconNetWorkBiz.CleanNetworkInformation(request);

                    result = coconResult.Key;
                    //Combine warning message Override & Cocon & Local cache
                    warningMessage = !string.IsNullOrWhiteSpace(coconResult.Value) ? string.Concat($"{warningMessage}. {coconResult.Value}") : warningMessage;
                }

                var isWawrning = !string.IsNullOrWhiteSpace(warningMessage);
                if (result == null)
                {
                    _logger.LogException(NimFiberLoggingEnum.NFI0002);
                    return StatusCode(isWawrning ? (int)HttpStatusCode.InternalServerError : (int)HttpStatusCode.NoContent, new CleanCoconResponse
                    {
                        IsWarning = isWawrning,
                        WarningMessage = warningMessage
                    });
                }
                else
                {
                    result.IsWarning = isWawrning;
                    result.WarningMessage = warningMessage;
                }

                _logger.LogException(NimFiberLoggingEnum.NFI0011);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0003, ex);
                return StatusCode(500, new CleanCoconResponse
                {
                    IsWarning = true,
                    WarningMessage = $"Nim internal error. Please contact WMS administrator to check nim module"
                });
            }
            finally
            {
                _logger.ResetAdditionalCorrelations();
            }
        }
    }
}
