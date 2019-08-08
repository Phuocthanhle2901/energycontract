using AutoMapper;
using CifwCocon.Entities.Models;
using CifwCocon.NetworkInformation.Bo;
using CoconService;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cifw.Mapper
{
    public class ChangePortQueueMapper : Profile
    {

        public ChangePortQueueMapper() : this("ChangePortQueueMapper")
        {

        }

        public ChangePortQueueMapper(string profileName) : base(profileName)
        {
            CreateMap<ChangePortQueueFf, ChangePortQueue>();
            CreateMap<ChangePortQueueRequest, ChangePortQueueFf>()
               .ForMember(dest => dest.ZipCode,
                    opts => opts.MapFrom(src => src.Postcode))
               .ForMember(dest => dest.HouseNumber,
                    opts => opts.MapFrom(src => src.HouseNr))
               .ForMember(dest => dest.HouseNumberExtension,
                    opts => opts.MapFrom(src => src.HouseExt));
        }
    }
}
