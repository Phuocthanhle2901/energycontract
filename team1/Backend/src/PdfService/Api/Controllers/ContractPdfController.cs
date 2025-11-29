using Api.Services.Interfaces;
using Api.VMs;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;
[ApiController]
[Route("api/pdf-contract")]
public class ContractPdfController : ControllerBase
{
    private readonly IPdfService _pdfService;
    private readonly ILogger<ContractPdfController> _logger;
    public ContractPdfController(IPdfService pdfService, ILogger<ContractPdfController> logger)
    {
        _pdfService = pdfService;
        _logger = logger;
    }
    /// <summary>
    /// Generate PDF for a contract
    /// </summary>
    [HttpPost("generate")]
    [ProducesResponseType(typeof(ContractPdfResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateContractPdf([FromBody] ContractPdfRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _logger.LogInformation($"Received request to generate PDF for contract: {request.ContractNumber}");

        var result = await _pdfService.GenerateContractPdfAsync(request);

        if (!result.Success)
        {
            return BadRequest(new ContractPdfResponse
            {
                Success = false,
                ErrorMessage = result.ErrorMessage
            });
        }

        return Ok(new ContractPdfResponse
        {
            Success = true,
            PdfUrl = result.PdfUrl,
            FileName = result.FileName
        });
    }
    /// <summary>
    /// Health check endpoint
    /// </summary>
    [HttpGet("health")]
    public IActionResult HealthCheck()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }

}