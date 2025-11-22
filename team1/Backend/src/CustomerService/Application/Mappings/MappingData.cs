
using Application.DTOs;
using Application.Features.Contracts.Commands.CreateContract;
using Application.Features.Contracts.Commands.DeleteContract;
using Application.Features.Contracts.Commands.GetContract;
using Application.Features.Contracts.Commands.UpdateContract;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings;

public class MappingData : Profile
{
    public MappingData()
    {
        CreateMap<CreateContract, Contract>();
        CreateMap<UpdateContract, Contract>();
        CreateMap<DeleteContract, Contract>();
        CreateMap<GetContractById, ContractDto>();
    }
}