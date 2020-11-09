using DomainModel;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.DeletingOrder
{
    public interface IOrderService
    {
        /// <summary>
        /// Delete forever information order in these databases: main, sla, cp_adapter
        /// </summary>
        /// <param name="wmsId">id here is wms_id</param>
        /// <returns>object dynamic with: (bool)isuccess, (string)message if any error, (object)exception if any</returns>
        Task<dynamic> DeleteByWmsId(long wmsId);

        Task<dynamic> DeleteByExternalOrderUid(string externalOrderId, string headerId, string headerSystemId);
        List<ResponseOrder> GetOrders(string externalOrderUid, string orderUid);
        List<ResponseOrder> GetOrdersByExternalOrderUid(string externalOrderUid);
        List<ResponseOrder> GetOrdersByWmsId(string wmsId);

    }
}
