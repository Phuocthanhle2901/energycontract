using AutoMapper;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.Utility;
using CoconService;
using System;
using System.Collections.Generic;

namespace Cifw.Mapper
{
    public class AddressMapper : Profile
    {
        public AddressMapper() : this("AddressMapper")
        {

        }

        public AddressMapper(string profileName) : base(profileName)
        {
            CreateMap<List<FieldValue>, Address>()
            .AfterMap((src, dest) =>
            {
                dest.Zipcode = Helpers.GetProperty(src, "ADDRESS.ZIPCODE");
                dest.HouseNumber = int.Parse(Helpers.GetProperty(src, "ADDRESS.HOUSENR"));
                dest.HouseNumberExtension = Helpers.GetProperty(src, "ADDRESS.HOUSENR_SUFFIX");
                dest.Room = Helpers.GetProperty(src, "ADDRESS.ROOM");
                dest.DeliveryClass = Helpers.GetProperty(src, "ADDRESS.DELIVERYSTATUS");
                dest.ConnenctionStatus = Helpers.GetProperty(src, "ADDRESS.FRAME");
                dest.Comments = Helpers.GetProperty(src, "ADDRESS.COMMENTS"); ;
                dest.FtuType = Helpers.GetProperty(src, "ADDRESS.FTUTYPE");
                dest.Area = MapperArea(src);               
                dest.HasDate = DateTime.TryParse(Helpers.GetProperty(src, "ADDRESS.HASDATE"), out DateTime hasDate) ? hasDate : (DateTime?) null;
            });
        }

        private Area MapperArea(List<FieldValue> properties)
        {
            return new Area
            {
                MonthlyCode = Helpers.GetProperty(properties, "NET_AREA.MONTHLYCODE"),
                OnceOnlyCode = Helpers.GetProperty(properties, "NET_AREA.ONCEONLYCODE"),
                RedemptionCode = Helpers.GetProperty(properties, "NET_AREA.REDEMPTIONCODE"),
                FixedChargeStatus = Helpers.GetProperty(properties, "ADDRESS.FIXEDCHARGE_STATUS")
            };
        }
    }
}
