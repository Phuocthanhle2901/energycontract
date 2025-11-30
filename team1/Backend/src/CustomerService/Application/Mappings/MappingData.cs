
using Application.DTOs;
using Application.Features.Addresses.Commands.CreateAddress;
using Application.Features.Contracts.Commands.CreateContract;
using Application.Features.Contracts.Commands.DeleteContract;
using Application.Features.Contracts.Commands.GetContract;
using Application.Features.Contracts.Commands.UpdateContract;
using Application.Features.Resellers.Commands.CreateReseller;
using Application.Features.Resellers.Commands.CreateReseller;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings;

public class MappingData : Profile
{
    public MappingData()
    {
        CreateMap<CreateContract, Contract>();
        CreateMap<GetContractById, ContractDto>();
        CreateMap<Reseller, ResellerDto>().ReverseMap(); // ReverseMap giúp map 2 chiều
        CreateMap<CreateReseller, Reseller>();    
        CreateMap<Address, AddressDto>().ReverseMap();
        CreateMap<CreateAddress, Address>();
    }
}