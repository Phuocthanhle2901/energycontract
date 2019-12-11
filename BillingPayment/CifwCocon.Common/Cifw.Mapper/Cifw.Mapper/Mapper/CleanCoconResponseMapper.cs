using AutoMapper;
using CifwCocon.Entities.Models;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.NetworkInformation.Bo.IntegrationEvents.Events;
using CoconService;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cifw.Mapper
{
    public class CleanCoconResponseMapper : Profile
    {

        public CleanCoconResponseMapper() : this("CleanCoconResponseMapper")
        {

        }

        public CleanCoconResponseMapper(string profileName) : base(profileName)
        {

            CreateMap<ChangePortQueueRequest, CleanCoconResponse>()
               .ForPath(dest => dest.Address.Zipcode,
                    opts => opts.MapFrom(src => src.Postcode))
                .ForPath(dest => dest.Address.HouseNumber,
                 opts => opts.MapFrom(src => src.HouseNr))
               .ForPath(dest => dest.Address.HouseNumberExtension,
                    opts => opts.MapFrom(src => src.HouseExt))
                .ForPath(dest => dest.Address.Room,
                    opts => opts.MapFrom(src => src.Room));

            CreateMap<UpdateLocalCacheByPatchIntegrationEvent, CleanCoconResponse>()
                .ForPath(dest => dest.Address.Zipcode,
                    opts => opts.MapFrom(src => src.Postcode))
                .ForPath(dest => dest.Address.HouseNumber,
                 opts => opts.MapFrom(src => src.HouseNr))
               .ForPath(dest => dest.Address.HouseNumberExtension,
                    opts => opts.MapFrom(src => src.HouseExt))
                .ForPath(dest => dest.Address.Room,
                    opts => opts.MapFrom(src => src.Room));
        }
    }
}
