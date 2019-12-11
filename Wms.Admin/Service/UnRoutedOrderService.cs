using Common;
using DomainModel;
using Entities.Main;
using IFD.Logging;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using Microsoft.Extensions.Configuration;
using static DomainModel.Enum.UnroutedEnum;

namespace Service
{
    public interface IUnroutedOrderService
    {
        ResponseUnroutedOrders GetAll(int page, int pageSize);
        IQueryable<Destination> GetDestinations();
        void Update(long wmsId, Destination destination);
    }
    public class UnroutedOrderService : IUnroutedOrderService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly ILogger _logger;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;
        public UnroutedOrderService(IUnitOfWork<MainContext> unitOfWork, ILogger logger, IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _clientFactory = clientFactory;
            _configuration = configuration;
        }

        public IQueryable<Destination> GetDestinations()
        {
            var destinationList = _unitOfWork.GetRepository<Beheerder>().GetAllByFilter()
                                                                        .Select(s => new Destination
                                                                        {
                                                                            BeheerderName = s.HeaderId,
                                                                            BeheerderSystemName = s.HeaderSystemId
                                                                        });

            return destinationList;
        }

        public List<UnroutedOrderModel> GetUnroutedOrders()
        {
            var unroutedOrderModels = new List<UnroutedOrderModel>();
            var unroutedOrders = _unitOfWork.GetRepository<BeheerderOrder>().GetAllByFilter(p => p.BeheerderId == null,
                                                                                            include: j => j.Include(i => i.Connection)
                                                                                                                .ThenInclude(i => i.HuurderOrder)
                                                                                                                .ThenInclude(i => i.Huurder)
                                                                                                            .Include(i => i.Connection)
                                                                                                                .ThenInclude(i => i.CustomerLocation)
                                                                                           ).GroupBy(q => q.WmsId).Select(g => g.First()).ToList();
            if (unroutedOrders.Count == 0)
            {
                return unroutedOrderModels;
            }

            var wmsIdList = unroutedOrders.Select(i => i.WmsId).ToList();
            var unroutedItems = _unitOfWork.GetRepository<Unrouted>().GetAllByFilter(p => wmsIdList.Contains(p.WmsId)).ToList();
            foreach (var item in unroutedOrders)
            {
                var huurder = item.Connection?.HuurderOrder?.FirstOrDefault()?.Huurder;
                if (huurder is null) continue;
                var unroutedOrderModel = new UnroutedOrderModel
                {
                    CifId = item.WmsId,
                    ExternalId = item.ExternalOrderUid,
                    CreationDate = item.StartDate,
                    NetworkType = item.Connection?.NetworkType?.ToString() ?? string.Empty,
                    FiberCode = item.Connection?.FiberCode?.ToString() ?? string.Empty,
                    Destination = "N/A",
                    Address = GetAddressString(item.Connection?.CustomerLocation, " - "),
                    Note = unroutedItems.FirstOrDefault(p => p.WmsId == item.WmsId)?.Reason ?? string.Empty
                };
                
                unroutedOrderModel.Source = huurder.HeaderId + " - " + huurder.HeaderSystemId;
                unroutedOrderModels.Add(unroutedOrderModel);
            }

            return unroutedOrderModels;
        }

        public string GetAddressString(CustomerLocation customerLocation, string delimiter)
        {
            if (customerLocation == null)
            {
                return string.Empty;
            }
            var strBuilder = new StringBuilder(customerLocation.ZipCode).Append(delimiter).Append(customerLocation.HouseNumber);
            if (!string.IsNullOrWhiteSpace(customerLocation.HouseNumberExtension))
            {
                strBuilder.Append(delimiter).Append(customerLocation.HouseNumberExtension);
            }
            if (!string.IsNullOrWhiteSpace(customerLocation.Room))
            {
                strBuilder.Append(delimiter).Append(customerLocation.Room);
            }

            return strBuilder.ToString();
        }

        public void Update(long wmsId, Destination destination)
        {
            try
            {
                var requestInfo = $"WmsId: {wmsId} - Destination: {destination.BeheerderName}/{destination.BeheerderSystemName}";
                var route = new RouteModel
                {
                    WmsId = wmsId,
                    Route = destination
                };
                var client = _clientFactory.CreateClient(HttpClientRegister.RestAPI.ToString());
                //Header
                client.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
                client.BaseAddress = new Uri(_configuration["FlowManagerApi"] + "/routing/updateRoute");
                HttpContent content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(route), Encoding.Unicode, "application/json");
                var response = client.PostAsync(string.Empty, content).Result;
                if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    _logger.LogException(LoggingEnum.UDR0009, message: $"Request Flowmanager Api sucessfully with request {requestInfo}:");
                    return;
                }

                var errMsg = $"Invalid Flowmanager Api response - Detail: HTTPCode: {response.StatusCode} Reason: {response.ReasonPhrase}. {requestInfo}";

                throw new ClientException(LoggingEnum.UDR0010, message: errMsg);
            }
            catch (ClientException)
            {
                throw;
            }
            // Timeout/Unavailable
            catch (AggregateException ex)
            {
                throw new ClientException(LoggingEnum.UDR0010, "Timeout - Request to Flowmanager Api failed", ex);
            }
            catch (Exception ex)
            {
                throw new ClientException(LoggingEnum.UDR0010, "Another exception - Request to Flowmanager Api failed", ex);
            }
        }

        public ResponseUnroutedOrders GetAll(int page, int pSize)
        {
            var result = GetUnroutedOrders().OrderByDescending(s => s.CreationDate).ToList();
            int tRecord = result.Count;
            int tPage = tRecord / pSize + (tRecord % pSize > 0 ? 1 : 0);
            var resultPagination = result.Skip((page - 1) * pSize).Take(pSize).ToList();

            return new ResponseUnroutedOrders
            {
                pageSize = pSize,
                totalItem = tRecord,
                totalPage = tPage,
                listItem = resultPagination
            };
        }
    }
}
