using AutoMapper;
using Cifw.Core.Enums;
using CifwCocon.Entities.Models;
using CifwCocon.NetworkInformation.Bo;
using System.Collections.Generic;
using System.Linq;

namespace Cifw.Mapper
{
    public class AddressCacheMapper : Profile
    {
        public AddressCacheMapper() : this("AddressCacheMapper")
        {

        }

        public AddressCacheMapper(string profileName) : base(profileName)
        {
            CreateMap<Fiber, CoconAddressFiber>()
                .ForMember(s => s.DateCreated, opt => opt.Ignore())
                .ForMember(s => s.LastUpdated, opt => opt.Ignore())
                .AfterMap((dest, src) =>
                {
                    dest.FiberType = src.FiberType;
                    dest.PopShelf = src.PopShelf;
                    dest.Closet = src.Closet;
                    dest.Row = src.Row;
                    dest.Position = src.Position;
                    dest.LocationName = string.IsNullOrWhiteSpace(src.LocationName) ? src.LocationName : src.LocationName.ToLower();
                    dest.Frame = src.Frame;
                    dest.PatchStatus = string.Empty;
                    dest.Port = src.Port;
                    dest.ActiveOperator = src.ActiveOperator;
                    dest.ActiveOrderTypePlanned = src.ActiveOrderTypePlanned;
                    dest.ActiveOperatorPlanned = src.ActiveOperatorPlanned;
                    dest.ActiveOperatorOrderIdPlanned = src.ActiveOperatorOrderIdPlanned;
                    dest.ActiveOperatorOrderId = src.ActiveOperatorOrderId;
                });

            CreateMap<FiberClean, CoconAddressFiber>()
                .ForMember(s => s.DateCreated, opt => opt.Ignore())
                .ForMember(s => s.LastUpdated, opt => opt.Ignore())
                .AfterMap((dest, src) =>
                {
                    dest.FiberType = src.FiberType;
                    dest.PopShelf = src.PopShelf;
                    dest.Closet = src.Closet;
                    dest.Row = src.Row;
                    dest.Position = src.Position;
                    dest.LocationName = string.IsNullOrWhiteSpace(src.LocationName)? src.LocationName : src.LocationName.ToLower();
                    dest.Frame = src.Frame;
                    dest.PatchStatus = string.Empty;
                    dest.Port = src.Port;
                    dest.ActiveOperator = src.ActiveOperator;
                    dest.ActiveOrderTypePlanned = src.ActiveOrderTypePlanned;
                    dest.ActiveOperatorPlanned = src.ActiveOperatorPlanned;
                    dest.ActiveOperatorOrderIdPlanned = src.ActiveOperatorOrderIdPlanned;
                    dest.ActiveOperatorOrderId = src.ActiveOperatorOrderId;
                });

            CreateMap<CoconAddressFiber, FiberClean>()
                .ForMember(s => s.IsCleanOk, opt => opt.Ignore())
                .ForMember(s => s.MessageClean, opt => opt.Ignore())
                .ForMember(s => s.Routing, opt => opt.Ignore())
                .AfterMap((dest, src) =>
                {
                    dest.FiberType = (byte)src.FiberType;
                    dest.PopShelf = src.PopShelf;
                    dest.Closet = src.Closet;
                    dest.Row = src.Row;
                    dest.Position = src.Position;
                    dest.LocationName = string.IsNullOrWhiteSpace(src.LocationName) ? src.LocationName : src.LocationName.ToLower();
                    dest.Frame = src.Frame;
                    dest.PatchStatus = string.Empty;
                    dest.Port = src.Port;
                    dest.ActiveOperator = src.ActiveOperator;
                    dest.ActiveOrderTypePlanned = src.ActiveOrderTypePlanned;
                    dest.ActiveOperatorPlanned = src.ActiveOperatorPlanned;
                    dest.ActiveOperatorOrderIdPlanned = src.ActiveOperatorOrderIdPlanned;
                    dest.ActiveOperatorOrderId = src.ActiveOperatorOrderId;
                });

            CreateMap<List<CoconAddressParty>, RoutingInfo>().AfterMap((s, d) =>
            {
                d.Beheerders = s.Where(q => q.PartyTypeId == (int)CoconEnum.PartyType.Beheerder && q.Name != null).Select(i => i.Name).ToList();
                d.BeheerderAreas = s.Where(q => q.PartyTypeId == (int)CoconEnum.PartyType.Beheerder && q.Area != null).Select(i => i.Area).ToList();
                d.Huurders = s.Where(q => q.PartyTypeId == (int)CoconEnum.PartyType.Huurder && q.Name != null).Select(i => i.Name).ToList();
                d.HuurderAreas = s.Where(q => q.PartyTypeId == (int)CoconEnum.PartyType.Huurder && q.Area != null).Select(i => i.Area).ToList();
            });

            CreateMap<CleanCoconResponse, CoconAddress>()
                .ForMember(src => src.Zipcode, opt => opt.MapFrom(dest => dest.Address.Zipcode))
                .ForMember(src => src.HouseNumber, opt => opt.MapFrom(dest => dest.Address.HouseNumber))
                .ForMember(src => src.HouseNumberExt, opt => opt.MapFrom(dest => dest.Address.HouseNumberExtension))
                .ForMember(src => src.Room, opt => opt.MapFrom(dest => dest.Address.Room))
                .ForMember(src => src.DeliveryClass, opt => opt.MapFrom(dest => dest.Address.DeliveryClass))
                .ForMember(src => src.ConnectionStatus, opt => opt.MapFrom(dest => dest.Address.ConnenctionStatus))
                .ForMember(src => src.CommentsOnDeliveryClass, opt => opt.MapFrom(dest => dest.Address.Comments))
                .ForMember(src => src.FtuType, opt => opt.MapFrom(dest => dest.Address.FtuType))
                .ForMember(src => src.AreaCode, opt => opt.MapFrom(dest => dest.Address.Area != null ? dest.Address.Area.AreaCode : null))
                .ForMember(src => src.MonthlyChangeCode, opt => opt.MapFrom(dest => dest.Address.Area != null ? dest.Address.Area.MonthlyCode : null))
                .ForMember(src => src.SingleChangeCode, opt => opt.MapFrom(dest => dest.Address.Area != null ? dest.Address.Area.OnceOnlyCode : null))
                .ForMember(src => src.RedemtionCode, opt => opt.MapFrom(dest => dest.Address.Area != null ? dest.Address.Area.RedemptionCode : null))
                .ForMember(src => src.FixedChangeStatus, opt => opt.MapFrom(dest => dest.Address.Area != null ? dest.Address.Area.FixedChargeStatus : null))
                .ForMember(src => src.HasBegin, opt => opt.MapFrom(dest => dest.Address.HasDate))
                .ForMember(src => src.DateCreated, opt => opt.Ignore())
                .ForMember(src => src.LastUpdated, opt => opt.Ignore())
                .ForMember(src => src.RemovedFromEol, opt => opt.Ignore())
                .ForMember(src => src.ProvidedFromEol, opt => opt.Ignore()).AfterMap((s, d) =>
                {
                    d.HouseNumberExt = !string.IsNullOrWhiteSpace(s.Address.HouseNumberExtension)
                        ? s.Address.HouseNumberExtension
                        : null;
                    d.Room = !string.IsNullOrWhiteSpace(s.Address.Room)
                        ? s.Address.Room
                        : null;
                });

            CreateMap<CoconAddress, Address>()
                .ForMember(src => src.Zipcode, opt => opt.MapFrom(dest => dest.Zipcode))
                .ForMember(src => src.HouseNumber, opt => opt.MapFrom(dest => dest.HouseNumber))
                .ForMember(src => src.HouseNumberExtension, opt => opt.MapFrom(dest => dest.HouseNumberExt))
                .ForMember(src => src.Room, opt => opt.MapFrom(dest => dest.Room))
                .ForMember(src => src.FtuType, opt => opt.MapFrom(dest => dest.FtuType))
                .ForMember(src => src.DeliveryClass, opt => opt.MapFrom(dest => dest.DeliveryClass))
                .ForMember(src => src.Comments, opt => opt.MapFrom(dest => dest.CommentsOnDeliveryClass))
                .ForMember(src => src.ConnenctionStatus, opt => opt.MapFrom(dest => dest.ConnectionStatus))
                .ForMember(src => src.HasDate, opt => opt.MapFrom(dest => dest.HasBegin))
                .AfterMap((s, d) =>
                {
                    d.Area = new Area
                    {
                        FixedChargeStatus = s.FixedChangeStatus,
                        MonthlyCode = s.MonthlyChangeCode,
                        RedemptionCode = s.RedemtionCode,
                        OnceOnlyCode = s.SingleChangeCode,
                        AreaCode = s.AreaCode
                    };
                    d.HouseNumberExtension = s.HouseNumberExt;
                });


            CreateMap<CifwCocon.NetworkInformation.Bo.InfrastructureOverride.Address, Address>()
              .ForMember(s => s.Area, o => o.Ignore())
              .ForMember(f => f.HouseNumberExtension, o => o.Ignore())
              .ForMember(f => f.HasDate, o => o.Ignore())
              .ForMember(f => f.Comments, o => o.Ignore())
              .ForMember(f => f.ConnenctionStatus, o => o.Ignore())
              .AfterMap((s, d) =>
            {
                d.HouseNumberExtension = s.HouseNumberExt;
                d.Area = new Area
                {
                    RedemptionCode = s.RedemtionCode,
                    MonthlyCode = s.MonthlyChangeCode,
                    FixedChargeStatus = s.FixedChangeStatus,
                    OnceOnlyCode = s.SingleChangeCode,
                    AreaCode = s.AreaCode
                };
                d.HasDate = s.HasBegin;
                d.Comments = s.CommentsOnDeliveryClass;
                d.ConnenctionStatus = s.Frame;
            });
            CreateMap<CifwCocon.NetworkInformation.Bo.InfrastructureOverride.Fiber, FiberClean>().ForMember(f => f.Routing, o => o.Ignore()).ForMember(f => f.FiberType, o => o.Ignore()).AfterMap(
            (s, d) =>
            {
                d.LocationName = !string.IsNullOrWhiteSpace(s.LocationName) ? s.LocationName.ToLower() : s.LocationName;
                d.Routing = new RoutingInfo
                {
                    Beheerders = s.Beheerders.Where(o=>!string.IsNullOrEmpty(o.Name) && !string.IsNullOrEmpty(o.Name)).Select(o => o.Name).Any() ? s.Beheerders.Select(o => o.Name).ToList() : null,
                    BeheerderAreas = s.Beheerders.Where(o => !string.IsNullOrEmpty(o.Area) && !string.IsNullOrEmpty(o.Area)).Select(o => o.Area).Any() ? s.Beheerders.Select(o => o.Area).ToList() : null,
                    Huurders = s.Huurders.Where(o => !string.IsNullOrEmpty(o.Name) && !string.IsNullOrEmpty(o.Name)).Select(o => o.Name).Any() ? s.Huurders.Select(o => o.Name).ToList() : null,
                    HuurderAreas = s.Huurders.Where(o => !string.IsNullOrEmpty(o.Area) && !string.IsNullOrEmpty(o.Area)).Select(o => o.Area).Any() ? s.Huurders.Select(o => o.Area).ToList() : null
                };
            });
        }
    }
}
