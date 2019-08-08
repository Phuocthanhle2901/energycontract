using CifwCocon.Entities.Models;
using CifwCocon.Repositories.Interface;
using CifwCocon.Repositories.Repositories;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using CifwCocon.ImportRepo.Entities;

namespace CifwCocon.Repositories
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private bool disposed = false;
        private readonly CifwCocon2018Context _context;

        private IGenericRepository<Configuration> configurationRepository;
        private IGenericRepository<CoconAddress> coconAddressRepository;
        private IGenericRepository<CoconBillingAddress> coconBillingAddressRepository;
        private IGenericRepository<CoconAddressFiber> coconAddressFiberRepository;
        private IGenericRepository<CoconAddressParty> coconAddressParty;
        private IGenericRepository<FileLogBilling> FileLogBillings;
        private IGenericRepository<CoconAddressFibersParties> coconAddressFibersPartiesRepo;
        private NetworkInfoRepository networkInfoRepo;

        public UnitOfWork(CifwCocon2018Context context)
        {
            _context = context;
        }

        public IGenericRepository<Configuration> ConfigurationRepository => configurationRepository ?? (configurationRepository = new GenericRepository<Configuration>(_context));
        
        public IGenericRepository<CoconAddress> CoconAddressRepository => coconAddressRepository ?? (coconAddressRepository = new GenericRepository<CoconAddress>(_context));
        public IGenericRepository<CoconBillingAddress> CoconBillingAddressRepository => coconBillingAddressRepository ?? (coconBillingAddressRepository = new GenericRepository<CoconBillingAddress>(_context));
        public IGenericRepository<CoconAddressFiber> CoconAddressFiberRepository => coconAddressFiberRepository ?? (coconAddressFiberRepository = new GenericRepository<CoconAddressFiber>(_context));
        public IGenericRepository<CoconAddressParty> CoconAddressPartyRepository => coconAddressParty ?? (coconAddressParty = new GenericRepository<CoconAddressParty>(_context));
        public IGenericRepository<CoconAddressFibersParties> CoconAddressFibersPartiesRepository => coconAddressFibersPartiesRepo ?? (coconAddressFibersPartiesRepo = new GenericRepository<CoconAddressFibersParties>(_context));
        public IGenericRepository<FileLogBilling> FileLogBilling => FileLogBillings ?? (FileLogBillings = new GenericRepository<FileLogBilling>(_context));
        public NetworkInfoRepository NetworkInfoRepository => networkInfoRepo ?? (networkInfoRepo = new NetworkInfoRepository(_context));

        public IDbContextTransaction BeginCifwCoconTransaction()
        {
            return _context.Database.BeginTransaction();
        }

        public void RollBackChanges()
        {
            var changedEntries = _context.ChangeTracker.Entries()
                .Where(x => x.State != EntityState.Unchanged).ToList();

            foreach (var entry in changedEntries)
            {
                switch (entry.State)
                {
                    case EntityState.Modified:
                        entry.CurrentValues.SetValues(entry.OriginalValues);
                        entry.State = EntityState.Unchanged;
                        break;
                    case EntityState.Added:
                        entry.State = EntityState.Detached;
                        break;
                    case EntityState.Deleted:
                        entry.State = EntityState.Unchanged;
                        break;
                }
            }
        }

        public void Commit()
        {
            _context.SaveChanges();
        }
        public int ExecStored(string sqlRaw)
        {
            return _context.Database.ExecuteSqlCommand(sqlRaw);
        }
        public async Task CommitAsync()
        {
            await _context.SaveChangesAsync();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
