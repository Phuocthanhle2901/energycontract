using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using IFD.Logging;
using CifwCocon.Entities.Models;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.Repositories;
using static Cifw.Core.Enums.CoconEnum;
using System;

namespace CifwCocon.NetworkInformation.Biz
{
    public class CoconAddressBiz
    {
        private ILogger _logger;
        private UnitOfWork _uow;
        private IMapper _mapper;

        public CoconAddressBiz(ILogger logger, UnitOfWork uow, IMapper mapper)
        {
            _logger = logger;
            _uow = uow;
            _mapper = mapper;
        }

        /// <summary>
        /// Response KeyValuePair
        /// - Key = Result 
        /// - Value = WarningMessage
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public KeyValuePair<CleanCoconResponse, string> GetCoconAddressLocalClean(ReadEntityRequestBo request)
        {
            try
            {
                var coconLocal = _uow.NetworkInfoRepository.GetNetworkInfo(request.Zipcode, request.HouseNumber, request.HouseNumberSuffix, request.Room);
                var response = new CleanCoconResponse();
                if (coconLocal != null)
                {
                    var address = _mapper.Map<CoconAddress, Address>(coconLocal);
                    var fiberA = coconLocal.CoconAddressFibersParties.Where(a => a.Fiber != null && a.Fiber.FiberType == (int)FiberEnum.FIBER_A).Select(q => q.Fiber).FirstOrDefault();
                    var fiberB = coconLocal.CoconAddressFibersParties.Where(a => a.Fiber != null && a.Fiber.FiberType == (int)FiberEnum.FIBER_B).Select(q => q.Fiber).FirstOrDefault();
                    List<CoconAddressParty> partyListFiberA = null;
                    List<CoconAddressParty> partyListFiberB = null;
                    if (request.FiberCode != null)
                    {
                        fiberA = request.FiberCode == FiberEnum.FIBER_A ? fiberA : null;
                        fiberB = request.FiberCode == FiberEnum.FIBER_B ? fiberB : null;
                    }

                    partyListFiberA = fiberA != null ? fiberA.CoconAddressFibersParties.Where(q => q.Party != null).Select(q => q.Party).ToList() : null;
                    partyListFiberB = fiberB != null ? fiberB.CoconAddressFibersParties.Where(q => q.Party != null).Select(q => q.Party).ToList() : null;

                    var networkInfo = new CleanCoconResponse
                    {
                        Address = address,
                        FiberA = fiberA != null ? _mapper.Map<CoconAddressFiber, FiberClean>(fiberA) : null,
                        FiberB = fiberB != null ? _mapper.Map<CoconAddressFiber, FiberClean>(fiberB) : null,
                    };
                    if (networkInfo.FiberA != null)
                    {
                        networkInfo.FiberA.Routing = partyListFiberA != null ? _mapper.Map<List<CoconAddressParty>, RoutingInfo>(partyListFiberA) : null;
                    }
                    if (networkInfo.FiberB != null)
                    {
                        networkInfo.FiberB.Routing = partyListFiberB != null ? _mapper.Map<List<CoconAddressParty>, RoutingInfo>(partyListFiberB) : null;
                    }

                    return new KeyValuePair<CleanCoconResponse, string>(networkInfo, null);
                }
                return new KeyValuePair<CleanCoconResponse, string>(null, null);
            }
            catch (Exception ex)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0035, ex);
                return new KeyValuePair<CleanCoconResponse, string>(null, $"Get fiber network from local cache is failed. Please contact with WMS administrator to check nim module");
            }
        }
    }
}
