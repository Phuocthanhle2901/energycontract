using DomainModel.TerminatedOrder;
using Entities.Main;
using IFD.Logging;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Dynamic;
using static EntitiesEnum.OrderContextConstants;

namespace Service
{
    public class TerminatedOrderService : ITerminatedOrderService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly ILogger _logger;

        private readonly IOrderRedis _ordeRedis;

        public TerminatedOrderService(IUnitOfWork<MainContext> unitOfWork, ILogger logger, IOrderRedis ordeRedis)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _ordeRedis = ordeRedis;
        }

        public TerminatedOrderResultDto Get(TerminatedOrderSearchDto search)
        {
            var result = new TerminatedOrderResultDto();
            var orders = from h in _unitOfWork.GetRepository<HuurderOrder>().GetAllByFilter(include: i => i.Include(i1 => i1.Huurder)
                                                                                               .Include(i2 => i2.Connection)
                                                                                               .ThenInclude(i2 => i2.CustomerLocation))
                         join b in _unitOfWork.GetRepository<BeheerderOrder>().GetAllByFilter(include: i => i.Include(i1 => i1.Beheerder))
                         on h.WmsId equals b.WmsId
                         where h.Status == Status.TERMINATED
                         select new
                         {
                             OrderData = new TerminatedOrdersDto
                             {
                                 WmsId = h.WmsId.ToString(),
                                 Huurder = $"{h.Huurder.HeaderId}-{h.Huurder.HeaderSystemId}",
                                 Address = h.Connection.CustomerLocation.SearchCode,
                                 CreateTime = h.StartDate,
                                 ExternalId = h.ExternalOrderUid,
                                 FiberCode = h.Connection.FiberCode.ToString(),
                                 NetworkType = h.Connection.NetworkType.ToString(),
                             },
                             LastHistory = h.LastHistory,
                             Beheerder = b.Beheerder
                         };

            if (!string.IsNullOrWhiteSpace(search.ExternalId))
                orders = orders.Where(w => w.OrderData.ExternalId.Contains(search.ExternalId));

            var s = orders.ToList();
            if (!string.IsNullOrWhiteSpace(search.WmsId))
                orders = orders.Where(w => w.OrderData.WmsId.Contains(search.WmsId));

            if (search.OrderType.HasValue)
            {
                if (search.OrderType.Value == OrderType.Deleted)
                    orders = orders.Where(w => w.OrderData.ExternalId.Contains("_deleted"));
                else 
                    orders = orders.Where(w => !w.OrderData.ExternalId.Contains("_deleted"));
            }

            orders = orders.OrderByDescending(t => t.OrderData.CreateTime);
            var totalCount = orders.Count();
            var pageSize = search.PageSize == 0 ? 10 : search.PageSize;
            var orderPagination = orders.Skip((search.Index - 1) * pageSize).Take(pageSize).ToList();

            var orderList = new List<TerminatedOrdersDto>();
            orderPagination.ForEach(t =>
            {
                var orderData = t.OrderData;
                orderData.Beheerder = t.Beheerder != null ? $"{t.Beheerder.HeaderId}-{t.Beheerder.HeaderSystemId}" : "N/A";
                if (t.LastHistory != null)
                    orderData.LastUpdateTime = t.LastHistory.EntryTime.Value;
                orderList.Add(orderData);
            });

            return new TerminatedOrderResultDto
            {
                TotalCount = totalCount,
                Data = orderList
            };
        }

        public dynamic UpdateTerminatedOrder(long wmsId)
        {

            dynamic result = new ExpandoObject();
            result.isSuccess = true;

            var huurderOrder = _unitOfWork.GetRepository<HuurderOrder>().GetFirstOrDefault(predicate: t => t.WmsId == wmsId && t.Status == Status.TERMINATED);
            var beheerderOrder = _unitOfWork.GetRepository<BeheerderOrder>().GetFirstOrDefault(predicate: t => t.WmsId == wmsId);
            if (huurderOrder == null || beheerderOrder == null)
            {
                result.isSuccess = false;
                result.exception = new Exception("This order does not exist");
            }
            else
            {
                var getExternalOrderUid = huurderOrder?.ExternalOrderUid;
                if (getExternalOrderUid.Contains("_deleted"))
                {
                    var externalOrderUid = getExternalOrderUid.Split('_');
                    getExternalOrderUid = externalOrderUid[0];
                }
                using (var transaction = _unitOfWork.BeginTransaction())
                {
                    try
                    {
                        huurderOrder.ExternalOrderUid = $"{huurderOrder.ExternalOrderUid}_deleted";
                        beheerderOrder.ExternalOrderUid = $"{beheerderOrder.ExternalOrderUid}_deleted";
                        _unitOfWork.GetRepository<HuurderOrder>().Update(huurderOrder);
                        _unitOfWork.GetRepository<BeheerderOrder>().Update(beheerderOrder);
                        result.result = _ordeRedis.DeleteOrderRedis(getExternalOrderUid);
                        if(result.result.Result == null)
                        {
                            result.isSuccess = false;
                            result.result = "Delete order to redis failed!";
                        }
                        _unitOfWork.SaveChanges();
                        transaction.Commit();
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        result.isSuccess = false;
                        result.result = e.InnerException?.Message ?? e.Message;
                    }
                }
            }
            

            return result;

        }

    }
}
