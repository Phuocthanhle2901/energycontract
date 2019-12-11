using AutoMapper;
using Common;
using DomainModel.CoconMapping;
using Entities.CoconMapping;
using IFD.Logging;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using static DomainModel.Enum.UnroutedEnum;
using coconMapping = Entities.CoconMapping.CoconMapping;
namespace Service.CoconMapping
{
    public class CoconMappingService : ICoconMappingService
    {
        private readonly IUnitOfWork<FulfillmentConfigContext> _unitOfFFM;
        private readonly IMapper _mapper;
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger _logger;
        public CoconMappingService(IUnitOfWork<FulfillmentConfigContext> unitOfFFM,IMapper mapper, 
            IHttpClientFactory clientFactory, ILogger logger)
        {
            _unitOfFFM = unitOfFFM;
            _mapper = mapper;
            _clientFactory = clientFactory;
            _logger = logger;
        }

        public void Delete(int id)
        {
            var coconmapping = _unitOfFFM.GetRepository<coconMapping>().GetFirstOrDefault(predicate:r=>r.Id==id);
            if(coconmapping ==null)
            {
                throw new Exception("This cocon_mapping does not exists");
            }

            else
            {
                _unitOfFFM.GetRepository<coconMapping>().Delete(id);
                _unitOfFFM.SaveChanges();
            }

                   
        }

        public CoconMappingResult GetAll(int page, int pageSize)
        {
            var result = new List<CoconMappingData>();
            var coconMappings = _unitOfFFM.GetRepository<coconMapping>().GetAllByFilter();
                
            if (coconMappings.Count() > 0)
            {
                foreach (var coconMapping in coconMappings)
                {
                    result.Add(_mapper.Map<CoconMappingData>(coconMapping));
                }
            }

          
            int tRecord = coconMappings.Count() ;
            int tPage = tRecord / pageSize + (tRecord % pageSize > 0 ? 1 : 0);
            var resultPagination = result.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new CoconMappingResult
            {
                pageSize = pageSize,
                totalItem = tRecord,
                totalPage = tPage,
                listItem = resultPagination
            };
        }

       

        public void Update(int id, CoconMappingData destination)
        {
            var coconmapping = _unitOfFFM.GetRepository<coconMapping>().GetFirstOrDefault(predicate: r => r.Id == id);
            if (coconmapping == null)
            {
                throw new Exception("This cocon_mapping does not exists");
            }
            else
            {
                coconmapping.CoconName = destination.CoconName;
                coconmapping.WmsName = destination.WmsName;
                coconmapping.WmsSystemName = destination.WmsSystemName;
                _unitOfFFM.GetRepository<coconMapping>().Update(coconmapping);
                _unitOfFFM.SaveChanges();
            }

        }
      

        public void Insert(coconMapping coconMappingData)
        {
            _unitOfFFM.GetRepository<coconMapping>().Insert(coconMappingData);
            _unitOfFFM.SaveChanges();

        }

        public List<Party> GetParty()
        {
            var getParty = GetHuurder().Union(GetBeheerder()).OrderBy(s=>s.HeaderId).ToList();
            return getParty;
        }
        public List<Party> GetBeheerder()
        {
            try
            {
                var client = _clientFactory.CreateClient(HttpClientRegister.BeheerderAPI.ToString());
                client.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
                var response = client.GetAsync(client.BaseAddress).Result;
                if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var dataStr = response.Content.ReadAsStringAsync().Result;
                    var data = JsonConvert.DeserializeObject<List<Party>>(dataStr);
                    return data;
                }
                var errMsg = $"Invalid Beheerder Api response - Detail: HTTPCode: {response.StatusCode} Reason: {response.ReasonPhrase}";
                throw new ClientException(LoggingEnum.UDR0024, message: errMsg);
            }
            // Timeout/Unavailable
            catch (AggregateException ex)
            {
                throw new ClientException(LoggingEnum.UDR0024, "Timeout - Request to Beheerder Api failed", ex);
            }
            catch (Exception ex)
            {
                throw new ClientException(LoggingEnum.UDR0024, "Another exception - Request to Beheerder Api failed", ex);
            }
        }

        public List<Party> GetHuurder()
        {
            try
            {
                var client = _clientFactory.CreateClient(HttpClientRegister.HuurderAPI.ToString());
                client.DefaultRequestHeaders.Add("X-Request-ID", _logger.GetCorrelationId());
                var response = client.GetAsync(client.BaseAddress).Result;
                if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var dataStr = response.Content.ReadAsStringAsync().Result;
                    var data = JsonConvert.DeserializeObject<List<Party>>(dataStr);
                    return data;
                }
                var errMsg = $"Invalid Huurder Api response - Detail: HTTPCode: {response.StatusCode} Reason: {response.ReasonPhrase}";
                throw new ClientException(LoggingEnum.UDR0026, errMsg);
            }
            // Timeout/Unavailable
            catch (AggregateException ex)
            {
                throw new ClientException(LoggingEnum.UDR0026, "Timeout - Request to Huurder Protals Api failed", ex);
            }
            catch (Exception ex)
            {
                throw new ClientException(LoggingEnum.UDR0026, "Another exception - Request to Huurder Protals Api failed", ex);
            }
        }
        public CoconMappingData Get(int id)
        {
            var coconMapping=_unitOfFFM.GetRepository<coconMapping>().GetFirstOrDefault(predicate: s => s.Id == id);
            if (coconMapping == null)
                return null;
            return new CoconMappingData
            {
                Id = coconMapping.Id,
                CoconName=coconMapping.CoconName,
                WmsName=coconMapping.WmsName,
                WmsSystemName=coconMapping.WmsSystemName
            };
        }
    }
}
