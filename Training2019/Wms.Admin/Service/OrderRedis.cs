using Common;
using IFD.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using static DomainModel.Enum.UnroutedEnum;

namespace Service
{
    public interface IOrderRedis
    {
        Task<string> DeleteOrderRedis(string externalOderUid);
    }
    public class OrderRedis : IOrderRedis
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger _logger;
        public OrderRedis(IHttpClientFactory clientFactory,ILogger logger)
        {
            _clientFactory = clientFactory;
            _logger=logger;
        }
        public async Task<string> DeleteOrderRedis(string externalOderUid)
        {
            try
            {
                var httpClient = _clientFactory.CreateClient(HttpClientRegister.OverrideAPI.ToString());
                httpClient.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
                var response = await httpClient.DeleteAsync($"/overrideapi/Redis/deleteOrder?externalOderUid={externalOderUid}");
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogException(LoggingEnum.UDR9999, ex);
            }
            return null;
        }
    }
}
