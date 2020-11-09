using System;
using CifwCocon.ImportRepo.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CifwCocon.Entities.Models
{
    public partial class CifwCocon2018Context : DbContext
    {
        public CifwCocon2018Context(DbContextOptions options) : base(options)
        {
        }

        public virtual DbSet<ChangePortQueueFf> ChangePortQueueFf { get; set; }
        public virtual DbSet<CoconAddress> CoconAddress { get; set; }
        public virtual DbSet<CoconAddressFiber> CoconAddressFiber { get; set; }
        public virtual DbSet<CoconAddressFibersParties> CoconAddressFibersParties { get; set; }
        public virtual DbSet<CoconAddressParty> CoconAddressParty { get; set; }
        public virtual DbSet<Configuration> Configuration { get; set; }
        public virtual DbSet<FileLogs> FileLogs { get; set; }
        public virtual DbSet<PartyType> PartyType { get; set; }
        public virtual DbSet<CoconBillingAddress> CoconBillingAddress { get; set; }
        public virtual DbSet<FileLogBilling> FileLogBillings { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer(@"Data Source=192.168.2.212;Initial Catalog=CifwCocon2018DUCM;user id=sa;password=123;MultipleActiveResultSets=True;Trusted_Connection=True;Persist Security Info=False;Integrated Security=false");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FileLogBilling>().ToTable("FileLogBillings");
            modelBuilder.Entity<ChangePortQueueFf>(entity =>
            {
                entity.ToTable("ChangePortQueueFF");

                entity.Property(e => e.DevicePort).HasMaxLength(50);

                entity.Property(e => e.ExternalId).HasMaxLength(50);

                entity.Property(e => e.HouseNumberExtension).HasMaxLength(50);

                entity.Property(e => e.OrderDate).HasColumnType("datetime");

                entity.Property(e => e.OrderType).HasMaxLength(50);

                entity.Property(e => e.RequestUser).HasMaxLength(50);

                entity.Property(e => e.Room).HasMaxLength(50);

                entity.Property(e => e.SentDate).HasColumnType("datetime");

                entity.Property(e => e.ZipCode)
                    .IsRequired()
                    .HasMaxLength(6);
            });

            modelBuilder.Entity<CoconAddress>(entity =>
            {
                entity.Property(e => e.AddressConnection).HasMaxLength(255);

                entity.Property(e => e.AreaCode).HasMaxLength(255);

                entity.Property(e => e.AreaNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Article)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CommentsOnDeliveryClass).HasMaxLength(255);

                entity.Property(e => e.ConnectionStatus).HasMaxLength(255);

                entity.Property(e => e.ContractArea)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DeliveryClass).HasMaxLength(255);

                entity.Property(e => e.FixedChangeStatus).HasMaxLength(255);

                entity.Property(e => e.FtuType).HasMaxLength(255);

                entity.Property(e => e.HasBegin).HasColumnType("datetime");

                entity.Property(e => e.HouseNumberExt).HasMaxLength(50);

                entity.Property(e => e.LastUpdated).HasColumnType("datetime");

                entity.Property(e => e.MonthlyChangeCode).HasMaxLength(255);

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NameOfRelation).HasMaxLength(255);                
              
                entity.Property(e => e.RedemtionCode).HasMaxLength(255);

                entity.Property(e => e.Room).HasMaxLength(255);

                entity.Property(e => e.ShortName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SingleChangeCode).HasMaxLength(255);

                entity.Property(e => e.Zipcode)
                    .IsRequired()
                    .HasMaxLength(6)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CoconAddressFiber>(entity =>
            {
                entity.Property(e => e.ActiveOperator).HasMaxLength(50);

                entity.Property(e => e.ActiveOperatorOrderId).HasMaxLength(32);

                entity.Property(e => e.ActiveOperatorOrderIdPlanned).HasMaxLength(32);

                entity.Property(e => e.ActiveOperatorPlanned).HasMaxLength(50);

                entity.Property(e => e.ActiveOrderTypePlanned).HasMaxLength(50);

                entity.Property(e => e.Closet).HasMaxLength(255);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Frame).HasMaxLength(255);

                entity.Property(e => e.LastUpdated).HasColumnType("datetime");

                entity.Property(e => e.LocationName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.OrderType)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PatchStatus)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.PopShelf)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Port).HasMaxLength(255);

                entity.Property(e => e.Position).HasMaxLength(255);

                entity.Property(e => e.Row).HasMaxLength(255);
            });

            modelBuilder.Entity<CoconAddressFibersParties>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.LastUpdated).HasColumnType("datetime");

                entity.HasOne(d => d.Address)
                    .WithMany(p => p.CoconAddressFibersParties)
                    .HasForeignKey(d => d.AddressId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__CoconAddressFibersParties__CoconAddress");

                entity.HasOne(d => d.Fiber)
                    .WithMany(p => p.CoconAddressFibersParties)
                    .HasForeignKey(d => d.FiberId)
                    .HasConstraintName("FK__CoconAddressFibersParties__CoconAddressFiber");

                entity.HasOne(d => d.Party)
                    .WithMany(p => p.CoconAddressFibersParties)
                    .HasForeignKey(d => d.PartyId)
                    .HasConstraintName("FK__CoconAddressFibersParties__CoconAddressParty");
            });

            modelBuilder.Entity<CoconAddressParty>(entity =>
            {
                entity.Property(e => e.Area).HasMaxLength(255);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.LastUpdated).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(255);

                entity.HasOne(d => d.PartyType)
                    .WithMany(p => p.CoconAddressParty)
                    .HasForeignKey(d => d.PartyTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__CoconAddressParty__PartyType");
            });

            modelBuilder.Entity<Configuration>(entity =>
            {
                entity.HasKey(e => e.Key);

                entity.Property(e => e.Key)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Environment)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Type)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Value)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<FileLogs>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.LastUpdated).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<PartyType>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(255);

                entity.Property(e => e.LastUpdated).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<CoconBillingAddress>(entity =>
            {
                entity.Property(e => e.AddressConnection)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Article)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.FixedChangeStatus)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.HousenumberExt)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LastUpdated).HasColumnType("datetime");

                entity.Property(e => e.NameOfRelation)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NoteAfterUpdateEntity)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Room)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Zipcode)
                    .IsRequired()
                    .HasMaxLength(6)
                    .IsUnicode(false);
            });
        }
    }
}
