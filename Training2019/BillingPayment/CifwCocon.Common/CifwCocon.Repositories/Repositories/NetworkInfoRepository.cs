using CifwCocon.Entities.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CifwCocon.Repositories.Repositories
{
    public class NetworkInfoRepository : GenericRepository<CoconAddress>
    {
        private readonly CifwCocon2018Context _context;

        public NetworkInfoRepository(CifwCocon2018Context context) : base(context)
        {
            _context = context;
        }

        public CoconAddress GetNetworkInfo(string zipCode, int houseNumber, string houseNumberExt, string room)
        {
            var networkInfo = _context.CoconAddress.Include(s => s.CoconAddressFibersParties)
                                .ThenInclude(s => s.Fiber)
                                .Include(s => s.CoconAddressFibersParties)
                                .ThenInclude(s => s.Party)
                                .FirstOrDefault(s => s.Zipcode == zipCode && s.HouseNumber == houseNumber && 
                                (string.IsNullOrEmpty(houseNumberExt) || s.HouseNumberExt == houseNumberExt) &&
                                (string.IsNullOrEmpty(room) || s.Room == room));

            return networkInfo;
        }

    }
}
