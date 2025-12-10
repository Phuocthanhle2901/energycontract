using Application.DTOs;

namespace Application.Features.Addresses.Commands.GetAllAddresses
{
    public class GetAllAddresses
    {
        public string? Search { get; set; }  // ZipCode / HouseNumber
        public string? ZipCode { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string? SortBy { get; set; } = "id"; // zipcode | housenumber | id
        public bool SortDesc { get; set; } = false;
    }
}