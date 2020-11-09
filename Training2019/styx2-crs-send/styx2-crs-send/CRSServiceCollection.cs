using CRSReference;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using styx2_crs_send.Core;
using styx2_crs_send.Midderwares;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Threading.Tasks;
using IFD.Logging;
using System.ServiceModel.Security;
using styx2_crs_send.Handle;
using System.Diagnostics.CodeAnalysis;

namespace styx2_crs_send
{
    [ExcludeFromCodeCoverage]
    public static class CRSServiceCollection
    {
        public static IServiceCollection AddCSRService(this IServiceCollection services, IConfiguration configuration, ILogger logger)
        {
            services.AddTransient(sp =>
            {
                // Create Channel for connection
                var factory = new ChannelFactory<TicketService>(CRSDataProviderUtils.GetBindingForEndpoint()
                    , new EndpointAddress(configuration["requestInfo:serviceEndPoint"]));
                
                // set up behavior as middle layer 
                factory.Endpoint.EndpointBehaviors.Add(new CustomEndpointBehavior(configuration, logger));
                factory.Endpoint.Binding.OpenTimeout = new TimeSpan(0, 0, int.Parse(configuration["WcfRequestTimeout"])); // set timeout for each request
                
                // disable check service certificate
                factory.Credentials.ServiceCertificate.SslCertificateAuthentication = new System.ServiceModel.Security.X509ServiceCertificateAuthentication()
                {
                    CertificateValidationMode = X509CertificateValidationMode.None,
                    RevocationMode = System.Security.Cryptography.X509Certificates.X509RevocationMode.NoCheck
                };

                // start to create wfc service client
                return factory.CreateChannel();
            });
            services.AddTransient<ICRSClient, CRSClient>();
            services.AddTransient<ICheckRequest, CheckRequest>();

            return services;
        }
    }
}
