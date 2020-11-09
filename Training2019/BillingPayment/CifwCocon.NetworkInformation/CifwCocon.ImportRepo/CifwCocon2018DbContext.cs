using System;
using CifwCocon.ImportRepo.Base;
using CifwCocon.ImportRepo.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CifwCocon.ImportRepo
{
    public class CifwCocon2018DbContext : DbContext
    {
        private string ConnectionString { get; }
        public DbSet<CoconAddress> CoconAddresses { get; set; }
        public DbSet<CoconBillingAddress> CoconBillingAddresses { get; set; }
        public DbSet<CoconAddressFiber> CoconAddressFibers { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<FileLogs> FileLogses { get; set; }
        public DbSet<PartyType> PartyTypes { get; set; }
        public DbSet<CoconAddressParty> CoconAddressParties { get; set; }
        public DbSet<CoconAddressFibersParties> CoconAddressFibersPartieses { get; set; }
        public CifwCocon2018DbContext(DbContextOptions<CifwCocon2018DbContext> options) : base(options) { }

        public CifwCocon2018DbContext()
        {
        }
        public CifwCocon2018DbContext(string connectionString)
        {
            ConnectionString = connectionString;
        }
        public static IConfiguration Configuration { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(ConnectionString);
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<CoconAddress>(entity =>
            {
                entity.ToTable("CoconAddress");
            });
            builder.Entity<CoconBillingAddress>(entity =>
            {
                entity.ToTable("CoconBillingAddress");
            });
            builder.Entity<FileLogs>().ToTable("FileLogs");
            builder.Entity<Configuration>().ToTable("Configuration");
            builder.Entity<PartyType>().ToTable("PartyType");
            builder.Entity<CoconAddressParty>(entity =>
            {
                entity.ToTable("CoconAddressParty");
                entity.HasOne(d => d.PartyType).WithMany(p => p.CoconAddressParties).HasForeignKey(d => d.PartyTypeId).HasConstraintName("FK_CoconAddressParty_PartyType");
            });

            builder.Entity<CoconAddressFibersParties>(entity =>
            {
                entity.ToTable("CoconAddressFibersParties");
                entity.HasOne(d => d.CoconAddress).WithMany(p => p.CoconAddressFibersPartieses).HasForeignKey(d => d.AddressId).HasConstraintName("FK_CoconAddressFibersParties_CoconAddress");
                entity.HasOne(d => d.CoconAddressFiber).WithMany(p => p.CoconAddressFibersPartieses).HasForeignKey(d => d.FiberId).HasConstraintName("FK_CoconAddressFibersParties_CoconAddressFiber");
                entity.HasOne(d => d.CoconAddressParty).WithMany(p => p.CoconAddressFibersPartieses).HasForeignKey(d => d.PartyId).HasConstraintName("FK_CoconAddressFibersParties_CoconAddressParty");
            });

            builder.Entity<CoconAddressFiber>(entity =>
            {
                entity.ToTable("CoconAddressFiber");
            });

        }
        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries<Entity>())
            {
                if (entry.Entity.IsDelete)
                {
                    entry.State = EntityState.Deleted;
                }
            }
            foreach (var entry in ChangeTracker.Entries<Entity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.DateCreated = DateTime.Now;
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastUpdated = DateTime.Now;
                        break;
                }
            }
            return base.SaveChanges();
        }
    }
}
