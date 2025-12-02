using Application.DTOs;
using Application.Interfaces;

namespace Application.Features.Orders.Commands.GetAllOrders
{
    public class GetAllOrdersHandler
    {
        private readonly IOrderRepository _orderRepository;

        public GetAllOrdersHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<List<OrderDto>> Handle(GetAllOrders request)
        {
            var orders = await _orderRepository.GetAllAsync(request.Limit);

            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                OrderType = o.OrderType,
                Status = o.Status,
                StartDate = o.StartDate,
                EndDate = o.EndDate,
                TopupFee = o.TopupFee,
                ContractId = o.ContractId
            }).ToList();
        }
    }
}