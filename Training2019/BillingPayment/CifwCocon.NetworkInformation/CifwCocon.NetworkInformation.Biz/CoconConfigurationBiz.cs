using CifwCocon.Entities.Models;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.Repositories;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using IFD.Logging;

namespace CifwCocon.NetworkInformation.Biz
{
    public class CoconConfigurationBiz
    {
        private UnitOfWork _uow;
        private IConfiguration _config;
        private IMemoryCache _cache;
        private int _memCacheThresHoldInSeconds;
        private ILogger _logger;
        public CoconConfigurationBiz(UnitOfWork uow, IConfiguration config, ILogger logger, IMemoryCache memoryCache)
        {
            _uow = uow;
            _config = config;
            _cache = memoryCache;
            _logger = logger;
            if (string.IsNullOrEmpty(_config["MemCacheThresHoldInSeconds"]))
            {
                throw new ArgumentNullException("MemCacheThresHoldInSeconds must be configed in appsettings.json");
            }

            _memCacheThresHoldInSeconds = int.Parse(_config["MemCacheThresHoldInSeconds"]);
        }

        public CoconConfiguration GetCoconConfiguration()
        {
            // Look for cache key.
            if (!_cache.TryGetValue(CoconConfigurationCacheKeys.ReadEntityCoconConfiguration, out CoconConfiguration cacheConfigurations))
            {
                // Key not in cache, so get data.
                // Set cache options.
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    // Keep in cache for this time, reset time if accessed.
                    .SetSlidingExpiration(TimeSpan.FromSeconds(_memCacheThresHoldInSeconds));

                var dbConfigurations = _uow.ConfigurationRepository.GetAll().Where(t => t.Environment == _config["Environment"]).ToList();

                cacheConfigurations = new CoconConfiguration
                {
                    UserName = dbConfigurations.Where(t => t.Key == "strUserName").First().Value,
                    Password = dbConfigurations.Where(t => t.Key == "strPassword").First().Value,
                    CbRetry = Int32.Parse(dbConfigurations.Where(t => t.Key == "cbRetry").First().Value),
                    CbTimeout = Int32.Parse(dbConfigurations.Where(t => t.Key == "cbTimeout").First().Value),
                    CentralCoconFolder = dbConfigurations.Where(t => t.Key == "strCentralCoconFolder").First().Value,
                    EndPoint = dbConfigurations.Where(t => t.Key == "strEndPoint").First().Value,
                    MaxSessions = Int32.Parse(dbConfigurations.Where(t => t.Key == "maxSessions").First().Value),
                    Environment = dbConfigurations.Where(t => t.Key == "strEnvironment").First().Value,
                    Contract = dbConfigurations.Where(t => t.Key == "strContract").First().Value,
                    Culture = dbConfigurations.Where(t => t.Key == "strCulture").First().Value,
                    EndPointPxq = dbConfigurations.Where(t => t.Key == "EndPointPxq").FirstOrDefault().Value ?? "",
                    UserWP = dbConfigurations.Where(t => t.Key == "UserWP").FirstOrDefault().Value ?? "",
                    PassWordWP = dbConfigurations.Where(t => t.Key == "PassWordWP").FirstOrDefault().Value ?? "",
                    CultureWP = dbConfigurations.Where(t => t.Key == "CultureWP").FirstOrDefault().Value ?? "",
                    CentralCoconFolderWP = dbConfigurations.Where(t => t.Key == "CentralCoconFolderWP").FirstOrDefault().Value ?? ""
                };

                _logger.Info("Load Cocon's configuration from database");

                // Save data in cache.
                _cache.Set(CoconConfigurationCacheKeys.ReadEntityCoconConfiguration, cacheConfigurations, cacheEntryOptions);
            }

            return cacheConfigurations;
        }

        public RetryConfiguration GetRetryConfiguration()
        {
            // Look for cache key.
            if (!_cache.TryGetValue(CoconConfigurationCacheKeys.ReadEntityRetryCoconConfiguration, out RetryConfiguration cacheRetryConfigurations))
            {
                // Key not in cache, so get data.
                // Set cache options.
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    // Keep in cache for this time, reset time if accessed.
                    .SetSlidingExpiration(TimeSpan.FromSeconds(_memCacheThresHoldInSeconds));

                var dbRetryConfigurations = _uow.ConfigurationRepository.GetAll().Where(t => t.Type == "RetryPattern" && t.Environment == _config["Environment"]).ToList();

                _logger.Info("Load RetryCocon's configuration from database");


                var retryCount = dbRetryConfigurations.Where(t => t.Key == "RetryCount").FirstOrDefault();
                var retryDelay = dbRetryConfigurations.Where(t => t.Key == "RetryDelay").FirstOrDefault();
                var retryTimeOut = dbRetryConfigurations.Where(t => t.Key == "RetryTimeOut").FirstOrDefault();

                cacheRetryConfigurations = new RetryConfiguration
                {
                    RetryCount = retryCount != null ? Int32.Parse(retryCount.Value) : 0,
                    RetryDelay = retryDelay != null ? Int32.Parse(retryDelay.Value) : 0,
                    ReTryTimeout = retryCount != null ? Int32.Parse(retryTimeOut.Value) : 0,
                };

                // Save data in cache.
                _cache.Set(CoconConfigurationCacheKeys.ReadEntityRetryCoconConfiguration, cacheRetryConfigurations, cacheEntryOptions);
            }

            return cacheRetryConfigurations;
        }
    }
}
