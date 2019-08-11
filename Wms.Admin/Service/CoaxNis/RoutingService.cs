using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Common;
using DomainModel.CoaxDto;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Service.Exceptions;
using static DomainModel.Enum.UnroutedEnum;

namespace Service.CoaxNis
{
    public class RoutingService : IRoutingService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger _logger;
        private readonly HttpClient _httpClient;
        public RoutingService(IConfiguration configuration, IHttpClientFactory clientFactory, ILogger logger)
        {
            _configuration = configuration;
            _clientFactory = clientFactory;
            _logger = logger;
            _httpClient = _clientFactory.CreateClient(HttpClientRegister.CoaxAPI.ToString());
            _httpClient.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
        }

        public async Task<string> Delete(int id)
        {
            var response = await _httpClient.DeleteAsync($"?id={id}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            return null;
        }

        public async Task<string> Get(int id)
        {
            var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/{id}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            return null;
        }
        public async Task<string> Get(QueryParams queryParams)
        {
            var requestMessage = new HttpRequestMessage(HttpMethod.Get, $"?page={queryParams.Page}&size={queryParams.Size}&orderBy={queryParams.OrderBy}&sortBy={queryParams.SortBy}");
            var response = await _httpClient.SendAsync(requestMessage);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            throw new RestfulException(response);
        }

        public async Task<string> Insert(DomainModel.Routing.RoutingModel routingModel)
        {
            var routing = new
            {
                huurderName = routingModel.HuurderName,
                huurderSystemName = routingModel.HuurderSystemName,
                beheerderName = routingModel.BeheerderName,
                beheerderSystemName = routingModel.BeheerderSystemName,
                areaId = routingModel.AreaId
            };
            var content = new StringContent(JsonConvert.SerializeObject(routing), Encoding.Unicode, "application/json");
            var response = await _httpClient.PostAsync(string.Empty, content);
            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return await response.Content.ReadAsStringAsync();
            }
            throw new RestfulException(response);
        }

        public async Task<string> Update(int id, DomainModel.Routing.RoutingModel routingModel)
        {
            var routing = new
            {
                huurderName = routingModel.HuurderName,
                huurderSystemName = routingModel.HuurderSystemName,
                beheerderName = routingModel.BeheerderName,
                beheerderSystemName = routingModel.BeheerderSystemName,
                areaId = routingModel.AreaId
            };
            var content = new StringContent(JsonConvert.SerializeObject(routing), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Put, $"?id={id}") { Content = content };
            var response = await _httpClient.SendAsync(request);
            if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return await response.Content.ReadAsStringAsync();
            }
            throw new RestfulException(response);
        }

        public async Task<string> Insert(RoutingModel routingModel)
        {
            var routing = new
            {
                huurderName = routingModel.HuurderName,
                huurderSystemName = routingModel.HuurderSystemName,
                beheerderName = routingModel.BeheerderName,
                beheerderSystemName = routingModel.BeheerderSystemName,
                areaId = routingModel.AreaId
            };
            var content = new StringContent(JsonConvert.SerializeObject(routing), Encoding.Unicode, "application/json");
            var response = await _httpClient.PostAsync(string.Empty, content);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            throw new RestfulException(response);
        }
       
        public List<AreaResult> GetAreas()
        {
            try
            {
                var client = _clientFactory.CreateClient(HttpClientRegister.CoaxAPI.ToString());
                client.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
                var response = client.GetAsync(client.BaseAddress + @"/areas").Result;
                if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var dataStr = response.Content.ReadAsStringAsync().Result;
                    var data = JsonConvert.DeserializeObject<List<AreaResult>>(dataStr);
                    return data;
                }
                var errMsg = $"Invalid Coax Api response - Detail: HTTPCode: {response.StatusCode} Reason: {response.ReasonPhrase}";
                throw new ClientException(LoggingEnum.UDR0025, errMsg);
            }
            // Timeout/Unavailable
            catch (AggregateException ex)
            {
                throw new ClientException(LoggingEnum.UDR0025, "Timeout - Request to Coax Api failed", ex);
            }
            catch (Exception ex)
            {
                throw new ClientException(LoggingEnum.UDR0025, "Another exception - Request to Coax Api failed", ex);
            }
        }

        public List<string> GetNetWorkType()
        {
            var listNetworkType = _configuration.GetSection("NetworkType").Get<List<string>>().ToList();
            return listNetworkType;
        }

        public List<string> GetFiberCode()
        {
            var listFiber = _configuration.GetSection("FiberCode").Get<List<string>>().ToList();
            return listFiber;
        }

        public List<Party> GetBeheerder()
        {
            try
            {
                var client = _clientFactory.CreateClient(HttpClientRegister.BeheerderAPI.ToString());
                client.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
                var response = client.GetAsync(client.BaseAddress).Result;
                if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var dataStr = response.Content.ReadAsStringAsync().Result;
                    var data = JsonConvert.DeserializeObject<List<Party>>(dataStr);
                    return data;
                }
                var errMsg = $"Invalid Beheerder Api response - Detail: HTTPCode: {response.StatusCode} Reason: {response.ReasonPhrase}";
                throw new ClientException(LoggingEnum.UDR0024, message: errMsg);
            }
            // Timeout/Unavailable
            catch (AggregateException ex)
            {
                throw new ClientException(LoggingEnum.UDR0024, "Timeout - Request to Beheerder Api failed", ex);
            }
            catch (Exception ex)
            {
                throw new ClientException(LoggingEnum.UDR0024, "Another exception - Request to Beheerder Api failed", ex);
            }
        }

        public List<Party> GetHuurder()
        {
            try
            {
                var client = _clientFactory.CreateClient(HttpClientRegister.HuurderAPI.ToString());
                client.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
                var response = client.GetAsync(client.BaseAddress).Result;
                if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var dataStr = response.Content.ReadAsStringAsync().Result;
                    var data = JsonConvert.DeserializeObject<List<Party>>(dataStr);
                    return data;
                }
                var errMsg = $"Invalid Huurder Api response - Detail: HTTPCode: {response.StatusCode} Reason: {response.ReasonPhrase}";
                throw new ClientException(LoggingEnum.UDR0026, errMsg);
            }
            // Timeout/Unavailable
            catch (AggregateException ex)
            {
                throw new ClientException(LoggingEnum.UDR0026, "Timeout - Request to Huurder Protals Api failed", ex);
            }
            catch (Exception ex)
            {
                throw new ClientException(LoggingEnum.UDR0026, "Another exception - Request to Huurder Protals Api failed", ex);
            }
        }

    }
}


