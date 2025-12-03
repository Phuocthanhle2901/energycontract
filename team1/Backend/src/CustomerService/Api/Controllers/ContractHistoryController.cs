using Application.DTOs;
using Application.Features.ContractHistories.Commands.CreateContractHistory;
using Application.Features.ContractHistories.Commands.GetHistoryByContractId;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/contract-histories")]
    public class ContractHistoryController : ControllerBase
    {
        private readonly CreateContractHistoryHandler _createHandler;
        private readonly GetHistoryByContractIdHandler _getHandler;

        public ContractHistoryController(
            CreateContractHistoryHandler createHandler,
            GetHistoryByContractIdHandler getHandler)
        {
            _createHandler = createHandler;
            _getHandler = getHandler;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateContractHistory request)
        {
            var id = await _createHandler.Handle(request);
            return Ok(id);
        }

        [HttpGet("{contractId}")]
        public async Task<ActionResult<List<ContractHistoryDto>>> Get(int contractId)
        {
            var histories = await _getHandler.Handle(new GetHistoryByContractId
            {
                ContractId = contractId
            });

            return Ok(histories);
        }
    }
}