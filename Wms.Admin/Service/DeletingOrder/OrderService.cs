using AutoMapper;
using DomainModel;
using Entities.Main;
using IFD.Logging;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Common;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using static DomainModel.Enum.UnroutedEnum;

namespace Service.DeletingOrder
{
    public class OrderService : IOrderService
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IMapper _mapper;
        private readonly IOrderRedis _ordeRedis;

        public OrderService(ILogger logger, IEnumerable<IUnitOfWork> unitOfWork, IMapper mapper, IHttpClientFactory clientFactory, IOrderRedis ordeRedis)
        {

            _logger = logger;
            _unitOfWork = unitOfWork.FirstOrDefault(r => r.GetType() == typeof(UnitOfWork<MainContext>)); ;
            _mapper = mapper;
            _clientFactory = clientFactory;
            _ordeRedis = ordeRedis;
        }

        private async Task<string> DeleteOrderCpAdapter(string wmsId)
        {
            try
            {
                var httpClient = _clientFactory.CreateClient(HttpClientRegister.CPWmsOrderHandlingAPI.ToString());
                httpClient.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());

                var response = await httpClient.DeleteAsync($"/cpwmsorderhandling/Orders/DeleteByTaskWmsId?id={wmsId}");
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
        /// <summary>
        /// delete order in main db
        /// </summary>
        /// <param name="wmsId"></param>
        /// <returns></returns>
        private async Task<string> DeleteOrderMain(string wmsId)
        {
            try
            {
                // if the order is renamed => skip the name again
                var getHuurderOrder = _unitOfWork.GetRepository<HuurderOrder>().GetByFilter(s=>s.WmsId.ToString()==wmsId && !s.ExternalOrderUid.Contains("deleted")).FirstOrDefault();
                if (getHuurderOrder != null)
                {
                    var httpClient = _clientFactory.CreateClient(HttpClientRegister.RestAPI.ToString());
                    httpClient.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
                    var response = await httpClient.DeleteAsync($"/ffflowmanager/huurder/orders/byWmsId?wmsId={wmsId}");
                    if (response.IsSuccessStatusCode)
                    {
                        return await response.Content.ReadAsStringAsync();
                    }
                }
                
            }
            catch (Exception ex)
            {
                _logger.LogException(LoggingEnum.UDR9999, ex);
            }
            return null;
        }

        private async Task<string> DeleteOrderSla(string wmsId)
        {
            try
            {
                var httpClient = _clientFactory.CreateClient(HttpClientRegister.RestAPI.ToString());
                httpClient.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
                var response = await httpClient.DeleteAsync($"/slacalculation/sla?wmsId={wmsId}");
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
        public List<ResponseOrder> GetOrders(string externalOrderUid, string orderUid)
        {
            IQueryable<HuurderOrder> orders = null;
            if (!string.IsNullOrEmpty(externalOrderUid) && string.IsNullOrEmpty(orderUid))
            {
                orders = _unitOfWork.GetRepository<HuurderOrder>().GetByFilter(s => s.ExternalOrderUid.Contains(externalOrderUid), includeProperties: "Huurder").AsQueryable().Take(10);
            }
            else if (string.IsNullOrEmpty(externalOrderUid) && !string.IsNullOrEmpty(orderUid))
            {
                orders = _unitOfWork.GetRepository<HuurderOrder>().GetAllByFilter(r => r.WmsId.ToString().Contains(orderUid)).Take(10);
            }
            else if (!string.IsNullOrEmpty(externalOrderUid) && !string.IsNullOrEmpty(orderUid))
            {
                orders = _unitOfWork.GetRepository<HuurderOrder>().GetAllByFilter(r => r.WmsId.ToString().Contains(orderUid) || r.ExternalOrderUid.Contains(externalOrderUid)).Take(10);
            }
            if (orders != null && orders.Any())
            {
                var result = orders.Select(s => new ResponseOrder
                {
                    ExternalOrderUid = s.ExternalOrderUid,
                    WmsId = s.WmsId.ToString(),
                    Status = s.Status.GetValueOrDefault().ToString(),
                    HeaderId = s.Huurder.HeaderId,
                    HeaderSystemId = s.Huurder.HeaderSystemId,
                    StartDate = s.StartDate.ToString(CultureInfo.InvariantCulture)
                }).Where(s => !s.ExternalOrderUid.Contains("deleted")).ToList();
                return result;
            }
            return null;
        }
        public List<ResponseOrder> GetOrdersByWmsId(string wmsId)
        {
            if (!string.IsNullOrEmpty(wmsId))
            {
                var orders = _unitOfWork.GetRepository<HuurderOrder>().GetAllByFilter(r => r.WmsId.ToString().Contains(wmsId)).Take(10);
                if (orders.Any())
                {
                    var result = orders.Select(s => new ResponseOrder
                    {
                        ExternalOrderUid = s.ExternalOrderUid,
                        WmsId = s.WmsId.ToString(),
                        Status = s.Status.GetValueOrDefault().ToString(),
                        HeaderId = s.Huurder.HeaderId,
                        HeaderSystemId = s.Huurder.HeaderSystemId,
                        StartDate = s.StartDate.ToString(CultureInfo.InvariantCulture)
                    }).ToList();
                    return result;
                }
            }
            return null;
        }
        public async Task<dynamic> DeleteByExternalOrderUid(string externalOrderId, string headerId, string headerSystemId)
        {
            var orders = _unitOfWork.GetRepository<HuurderOrder>().GetAllByFilter(s => s.ExternalOrderUid == externalOrderId, include: i => i.Include(s => s.Huurder));
            var order = orders.FirstOrDefault(s => s.Huurder.HeaderId == headerId && s.Huurder.HeaderSystemId == headerId);
            dynamic result = new ExpandoObject();
            if (order != null)
            {
                result = await Delete(order.WmsId);
                return result;
            }
            return null;
        }
        public async Task<dynamic> DeleteByWmsId(long wmsId)
        {
            var result = await Delete(wmsId);
            return result;
        }
        private async Task<dynamic> Delete(long wmsId)
        {

            dynamic result = new ExpandoObject();
            result.deleteRedis = null;
            // delete cache
            var order = _unitOfWork.GetRepository<HuurderOrder>().GetAllByFilter(s => s.WmsId == wmsId).FirstOrDefault();

            var resultDeleteOrderFromMain = await DeleteOrderMain(wmsId.ToString());
            var resultDeleteOrderFromSla = await DeleteOrderSla(wmsId.ToString());
            var resultDeleteOrderFromCpAdapter = await DeleteOrderCpAdapter(wmsId.ToString());

            
            if(order !=null)
            {
                var resultDeleteOrderFromRedis = await _ordeRedis.DeleteOrderRedis(order.ExternalOrderUid);
                result.deleteRedis = resultDeleteOrderFromRedis;
            }
           

            result.deleteMain = resultDeleteOrderFromMain;
            result.deleteSla = resultDeleteOrderFromSla;
            result.deleteCpAdapter = resultDeleteOrderFromCpAdapter;

            return result;
        }

        public List<ResponseOrder> GetOrdersByExternalOrderUid(string externalOrderUid)
        {
            throw new NotImplementedException();
        }
    }
}
