namespace Api.Services.Interfaces;

public interface IPdfService
{
    Task<VMs.PdfGenerationResult> GenerateContractPdfAsync(VMs.ContractPdfRequest request);
}