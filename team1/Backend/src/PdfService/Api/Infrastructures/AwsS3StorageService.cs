using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Api.Services.Interfaces;
namespace Api.Infrastructures;

public class MinioStorageService : IStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly ILogger<MinioStorageService> _logger;

    public MinioStorageService(
        IAmazonS3 s3Client,
        IConfiguration configuration,
        ILogger<MinioStorageService> logger)
    {
        _s3Client = s3Client;
        _bucketName = configuration["AWS:BucketName"] ?? "energy-contracts";
        _logger = logger;
        
        EnsureBucketExistsAsync().Wait();
    }

    private async Task EnsureBucketExistsAsync()
    {
        try
        {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, _bucketName);
            
            if (!bucketExists)
            {
                _logger.LogInformation($"Creating bucket: {_bucketName}");
                await _s3Client.PutBucketAsync(new PutBucketRequest
                {
                    BucketName = _bucketName,
                    UseClientRegion = true
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error ensuring bucket exists");
        }
    }

    public async Task<string> UploadPdfAsync(byte[] pdfBytes, string fileName, string folder = "contracts")
    {
        var key = $"{folder}/{DateTime.UtcNow:yyyy/MM/dd}/{fileName}";
        
        try
        {
            using var memoryStream = new MemoryStream(pdfBytes);
            
            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = memoryStream,
                Key = key,
                BucketName = _bucketName,
                ContentType = "application/pdf",
                CannedACL = S3CannedACL.Private
            };

            var transferUtility = new TransferUtility(_s3Client);
            await transferUtility.UploadAsync(uploadRequest);

            // Generate presigned URL (7 days)
            var urlRequest = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            var url = _s3Client.GetPreSignedURL(urlRequest);
            
            _logger.LogInformation($"File uploaded: {key}");
            return url;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error uploading file: {fileName}");
            throw;
        }
    }

    public async Task<bool> DeleteFileAsync(string fileUrl)
    {
        try
        {
            var uri = new Uri(fileUrl);
            var key = uri.AbsolutePath.TrimStart('/');
            
            await _s3Client.DeleteObjectAsync(new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            });
            
            _logger.LogInformation($"File deleted: {key}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file");
            return false;
        }
    }
}