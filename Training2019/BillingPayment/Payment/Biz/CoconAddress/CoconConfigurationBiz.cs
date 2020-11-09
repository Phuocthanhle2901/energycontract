using CifwCocon.NetworkInformation.Bo;
using CifwCocon.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;

namespace Payment.Biz
{
    public class CoconConfigurationBiz
    {
        private UnitOfWork _uow;
        private IConfiguration _config;
        public CoconConfigurationBiz(UnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public CoconConfiguration GetCoconConfiguration()
        {
            var configurations = _uow.ConfigurationRepository.GetAll().Where(t => t.Environment == _config["Environment"]);
            return new CoconConfiguration
            {
                UserName = configurations.Where(t => t.Key == "strUserName").First().Value,
                Password = configurations.Where(t => t.Key == "strPassword").First().Value,
                CbRetry = Int32.Parse(configurations.Where(t => t.Key == "cbRetry").First().Value),
                CbTimeout = Int32.Parse(configurations.Where(t => t.Key == "cbTimeout").First().Value),
                CentralCoconFolder = configurations.Where(t => t.Key == "strCentralCoconFolder").First().Value,
                EndPoint = configurations.Where(t => t.Key == "strEndPoint").First().Value,
                MaxSessions = Int32.Parse(configurations.Where(t => t.Key == "maxSessions").First().Value),
                Environment = configurations.Where(t => t.Key == "strEnvironment").First().Value,
                Contract = configurations.Where(t => t.Key == "strContract").First().Value,
                Culture = configurations.Where(t => t.Key == "strCulture").First().Value               
            };
        }

        public RetryConfiguration GetRetryConfiguration()
        {
            var configurations = _uow.ConfigurationRepository.GetAll().Where(t => t.Type == "RetryPattern" && t.Environment == _config["Environment"]);
            var retryCount = configurations.Where(t => t.Key == "RetryCount").FirstOrDefault();
            var retryDelay = configurations.Where(t => t.Key == "RetryDelay").FirstOrDefault();
            var retryTimeOut = configurations.Where(t => t.Key == "RetryTimeOut").FirstOrDefault();
            return new RetryConfiguration
            {
                RetryCount = retryCount != null ? Int32.Parse(retryCount.Value) : 0,
                RetryDelay = retryDelay != null ? Int32.Parse(retryDelay.Value) : 0,
                ReTryTimeout = retryCount != null ? Int32.Parse(retryTimeOut.Value) : 0,
            };
        }
    }
}
