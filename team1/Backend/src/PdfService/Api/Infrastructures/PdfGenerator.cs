using Api.Services.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using HtmlAgilityPack;

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
            // Convert HTML to plain text for QuestPDF
            var textContent = await Task.Run(() => ExtractTextFromHtml(htmlContent));
            
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(20); // 20 points margin on all sides
                    
                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            column.Item().Text(textContent)
                                .FontSize(12)
                                .LineHeight(1.5f);
                        });
                });
            });

            var pdfBytes = await Task.Run(() => document.GeneratePdf());
            _logger.LogInformation("PDF generated successfully using QuestPDF");
            
            return pdfBytes;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating PDF from HTML using QuestPDF");
            throw;
        }
    }
    
    private string ExtractTextFromHtml(string htmlContent)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(htmlContent);
        return doc.DocumentNode.InnerText;
    }
}
