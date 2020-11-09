using System;
using System.Dynamic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Cifw.Core.Constants;
using Cifw.Core.Enums;
using IFD.Logging;
using CifwCocon.NetworkInformation.Bo;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Address = CifwCocon.NetworkInformation.Bo.InfrastructureOverride.Address;
using StackExchange.Redis;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;

namespace CifwCocon.NetworkInformation.Biz
{
    public interface IInfrastructureOverrideService
    {
        Task<KeyValuePair<CleanCoconResponse, string>> Get(ReadEntityRequestBo request);
    }
    public class InfrastructureOverrideService : IInfrastructureOverrideService
    {
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IConnectionMultiplexer _connectionMultiplexer;
        private readonly IDatabase _redisDatabase;
        public InfrastructureOverrideService(IConnectionMultiplexer connectionMultiplexer, IConfiguration configuration, IMapper mapper, ILogger logger)
        {
            _configuration = configuration;
            _mapper = mapper;
            _logger = logger;
            _connectionMultiplexer = connectionMultiplexer;
            _redisDatabase = _connectionMultiplexer.GetDatabase();
        }

        private async Task<Address> GetByKeyAsync(string key)
        {
            if (string.IsNullOrEmpty(key)) throw new ArgumentNullException();            
            var result = await _redisDatabase.HashGetAsync(key, _configuration["Data:redis:hashField"]);
            if (result.IsNull)
            {
                return null;
            }
            var entityJson = Encoding.UTF8.GetString(result);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<Address>(entityJson);
        }
        private CleanCoconResponse MappToResponse(Address addressFromOverride, CoconEnum.FiberEnum? fiberCode)
        {
            var address = _mapper.Map<Bo.Address>(addressFromOverride);
            var result = new CleanCoconResponse
            {
                Address = address,
                FromNetwork = CoconConstants.FromNetwork.Override
            };
            if (addressFromOverride.Fibers.Any())
            {
                if (fiberCode == CoconEnum.FiberEnum.FIBER_A)
                {

                    var fiberA = addressFromOverride.Fibers.Find(s => s.FiberType == CoconEnum.FiberEnum.FIBER_A.ToString());
                    if (fiberA != null)
                    {
                        result.FiberA = _mapper.Map<FiberClean>(fiberA);
                    }
                }
                if (fiberCode == CoconEnum.FiberEnum.FIBER_B)
                {
                    var fiberB = addressFromOverride.Fibers.Find(s => s.FiberType == CoconEnum.FiberEnum.FIBER_B.ToString());
                    if (fiberB != null)
                    {
                        result.FiberB = _mapper.Map<FiberClean>(fiberB);
                    }
                }
            }
            return result;
        }

        private dynamic GetKey(ReadEntityRequestBo request)
        {
            dynamic result = new ExpandoObject();
            var delimiter = _configuration["delimiter"];
            result.success = true;
            {
                if (string.IsNullOrEmpty(request.Zipcode))
                {
                    result.success = false;
                }
                if (request.HouseNumber == 0)
                {
                    result.success = false;
                }
                if (string.IsNullOrEmpty(delimiter))
                {
                    result.success = false;
                }
                if (result.success)
                {
                    var originalContent = new StringBuilder($"{request.Zipcode}{delimiter}{request.HouseNumber}");
                    if (!string.IsNullOrEmpty(request.HouseNumberSuffix))
                    {
                        originalContent.Append(delimiter).Append(request.HouseNumberSuffix);
                    }
                    if (!string.IsNullOrEmpty(request.Room))
                    {
                        originalContent.Append(delimiter).Append(request.Room);
                    }
                    var originalKey = GetHasCode(originalContent.ToString());



                    var content2 = new StringBuilder($"{request.Zipcode}{delimiter}{request.HouseNumber}");
                    if (!string.IsNullOrEmpty(request.HouseNumberSuffix))
                    {
                        if (request.HouseNumberSuffix.Any(char.IsUpper))
                        {
                            content2.Append(delimiter).Append(request.HouseNumberSuffix.ToLower());
                        }
                        else
                        {
                            content2.Append(delimiter).Append(request.HouseNumberSuffix.ToUpper());
                        }
                    }
                    if (!string.IsNullOrEmpty(request.Room))
                    {
                        content2.Append(delimiter).Append(request.Room);
                    }
                    var key2 = GetHasCode(content2.ToString());



                    string[] contents = { originalKey, key2 };
                    result.contents = contents;
                }
            }
            return result;
        }

        /// <summary>
        /// Get address from override redis cache
        /// </summary>
        /// <param name="request">from http(https) contain zipcode, housenumber, housenumberextension, room</param>
        /// <returns>CleanCoconResponse</returns>
        public async Task<KeyValuePair<CleanCoconResponse, string>> Get(ReadEntityRequestBo request)
        {
            _logger.LogException(NimFiberLoggingEnum.NFI0017);
            CleanCoconResponse result = null;
            try
            {
                var getKeyResult = GetKey(request);
                if (getKeyResult.success)
                {
                    if (getKeyResult.contents is string[] keys && keys.Any())
                    {
                        foreach (var item in keys)
                        {
                            var address = await GetByKeyAsync(item);
                            if (address != null)
                            {
                                result = MappToResponse(address, request.FiberCode);
                                break;
                            }
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0005, exception);
                return new KeyValuePair<CleanCoconResponse, string>(result, $"Get fiber network from override is failed. Please contact with WMS administrator to check nim module");
            }
            return new KeyValuePair<CleanCoconResponse, string>(result, null);
        }

        private string GetHasCode(string combine)
        {
            if (string.IsNullOrEmpty(combine)) throw new ArgumentNullException(combine);
            var md5Hasher = MD5.Create();
            var hashed = md5Hasher.ComputeHash(Encoding.UTF8.GetBytes(combine));
            var ivalue = BitConverter.ToInt32(hashed, 0);
            return ivalue.ToString();
        }
    }
}
