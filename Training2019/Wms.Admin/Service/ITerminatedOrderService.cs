using DomainModel.TerminatedOrder;
using System.Threading.Tasks;

namespace Service
{
    public interface ITerminatedOrderService
    {
        TerminatedOrderResultDto Get(TerminatedOrderSearchDto search);
        dynamic UpdateTerminatedOrder(long wmsId);
    }
}
