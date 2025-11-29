using Api.Services.Interfaces;
namespace Api.Infrastructures;

public class PdfGenerator : IPdfGenerator
{
    private readonly ILogger<PdfGenerator> _logger;
    public PdfGenerator(ILogger<PdfGenerator> logger)
    {
        _logger = logger;
    }
    public async Task<byte[]> GeneratePdfFromHtmlAsync(string htmlContent)
    {
        try
        {
            var renderer = new ChromePdfRenderer();
            renderer.RenderingOptions.PaperSize = PdfPrintOptions.PdfPaperSize.A4;
            renderer.RenderingOptions.MarginTop = 20;
            renderer.RenderingOptions.MarginBottom = 20;
            renderer.RenderingOptions.MarginLeft = 20;
            renderer.RenderingOptions.MarginRight = 20;
            var pdf = await Task.Run(()=> renderer.RenderHtmlAsPdfAsync(htmlContent));
            _logger.LogInformation("Pdf generated successfully");
            return pdf.BinaryData;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,"Error generating PDF from HTML.");
            throw;
        }
    }
}