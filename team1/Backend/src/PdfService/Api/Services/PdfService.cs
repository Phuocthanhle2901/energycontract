using Api.Services.Interfaces;
using Api.VMs;

namespace Api.Services;

public class PdfService : IPdfService
{
    private readonly IPdfGenerator _pdfGenerator;
    private readonly IStorageService _storageService;
    private readonly ITemplateService _templateService;
    private readonly ILogger<PdfService> _logger;
    public PdfService(
        IPdfGenerator pdfGenerator,
        IStorageService storageService,
        ITemplateService templateService,
        ILogger<PdfService> logger)
    {
        _pdfGenerator = pdfGenerator;
        _storageService = storageService;
        _templateService = templateService;
        _logger = logger;
    }
    public async Task<PdfGenerationResult> GenerateContractPdfAsync(ContractPdfRequest request)
    {
        try
        {
            _logger.LogInformation($"Generating PDF for contract: {request.ContractNumber}");

            // 1. Get template
            var htmlTemplate = await _templateService.GetTemplateByNameAsync("ContractTemplate");

            // 2. Prepare data
            var templateData = new Dictionary<string, string>
            {
                { "ContractNumber", request.ContractNumber },
                { "StartDate", request.StartDate.ToString("dd/MM/yyyy") },
                { "EndDate", request.EndDate.ToString("dd/MM/yyyy") },
                { "FullName", $"{request.FirstName} {request.LastName}".Trim() },
                { "FirstName", request.FirstName },
                { "LastName", request.LastName },
                { "Email", request.Email },
                { "Phone", request.Phone },
                { "CompanyName", request.CompanyName ?? "N/A" },
                { "BankAccount", request.BankAccountNumber ?? "N/A" },
                { "Address", request.AddressLine },
                { "TotalAmount", request.TotalAmount.ToString("N2") },
                { "Currency", request.Currency },
                { "GeneratedDate", DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm") }
            };

            // 3. Render template
            var renderedHtml = _templateService.RenderTemplate(htmlTemplate, templateData);

            // 4. Generate PDF
            var pdfBytes = await _pdfGenerator.GeneratePdfFromHtmlAsync(renderedHtml);

            // 5. Upload to storage
            var fileName = $"contract_{request.ContractNumber}_{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";
            var pdfUrl = await _storageService.UploadPdfAsync(pdfBytes, fileName);

            _logger.LogInformation($"PDF generated successfully: {fileName}");

            return new PdfGenerationResult
            {
                Success = true,
                PdfUrl = pdfUrl,
                FileName = fileName
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error generating PDF for contract: {request.ContractNumber}");
            return new PdfGenerationResult
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }
}