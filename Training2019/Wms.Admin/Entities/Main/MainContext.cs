using EntitiesEnum;
using Microsoft.EntityFrameworkCore;
using System;
using static DomainModel.Enum.OrderSlaEnum;
using static EntitiesEnum.OrderContextConstants;

namespace Entities.Main
{
    public class MainContext : DbContext
    {
        public MainContext()
        {
        }

        public MainContext(DbContextOptions<MainContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Beheerder> Beheerder { get; set; }
        public virtual DbSet<BeheerderOrder> BeheerderOrder { get; set; }
        public virtual DbSet<Connection> Connection { get; set; }
        public virtual DbSet<CustomerLocation> CustomerLocation { get; set; }
        public virtual DbSet<Huurder> Huurder { get; set; }
        public virtual DbSet<HuurderOrder> HuurderOrder { get; set; }
        public virtual DbSet<Unrouted> Unrouted { get; set; }
        public virtual DbSet<OrderSlaType> OrderSlaType { get; set; }
        public virtual DbSet<HuurderOrderHistory> HuurderOrderHistory { get; set; }
        // Unable to generate entity type for table 'Main.OrderDependency'. Please see the warning messages.

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySQL("server=localhost;port=3306;user=root;password=123456;database=main");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           

            modelBuilder.Entity<Beheerder>(entity =>
            {
                entity.ToTable("beheerder", "main");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.HeaderId)
                    .IsRequired()
                    .HasColumnName("header_id")
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.HeaderSystemId)
                    .IsRequired()
                    .HasColumnName("header_system_id")
                    .HasMaxLength(15)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<BeheerderOrder>(entity =>
            {
                entity.ToTable("beheerder_order", "main");

                entity.HasIndex(e => e.BeheerderId)
                    .HasName("fk_BeheerderOrder_Beheerder");

                entity.HasIndex(e => e.ConnectionId)
                    .HasName("fk_BeheerderOrder_Connection");

                entity.HasIndex(e => e.WmsId)
                    .HasName("WmsId_UNIQUE")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.BeheerderId)
                    .HasColumnName("beheerder_id")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.ConnectionId)
                    .HasColumnName("connection_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.ExternalOrderUid)
                    .IsRequired()
                    .HasColumnName("external_order_uid")
                    .HasMaxLength(32)
                    .IsUnicode(false);

                entity.Property(e => e.OrderType)
                   .HasColumnName("order_type")
                   .HasConversion(
                       v => v.ToString(),
                       v => (OrderType)System.Enum.Parse(typeof(OrderType), v));

                entity.Property(e => e.Status)
                   .IsRequired()
                   .HasColumnName("status")
                   .HasConversion(
                       v => v.ToString(),
                       v => (OrderContextConstants.Status)System.Enum.Parse(typeof(OrderContextConstants.Status), v));

                entity.Property(e => e.WmsId)
                    .HasColumnName("wms_id")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.StartDate)
                    .HasColumnName("start_date");

                entity.HasOne(d => d.Beheerder)
                    .WithMany(p => p.BeheerderOrder)
                    .HasForeignKey(d => d.BeheerderId)
                    .HasConstraintName("fk_BeheerderOrder_Beheerder");

                entity.HasOne(d => d.Connection)
                    .WithMany(p => p.BeheerderOrder)
                    .HasForeignKey(d => d.ConnectionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_BeheerderOrder_Connection");
            });

         


            modelBuilder.Entity<Connection>(entity =>
            {
                entity.ToTable("connection", "main");

                entity.HasIndex(e => e.CustomerLocationId)
                    .HasName("Connection_CustomerLocation_PK");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

   

                entity.Property(e => e.CustomerLocationId)
                    .HasColumnName("customer_location_id")
                    .HasColumnType("int(255)")
                    .HasDefaultValueSql("NULL");


                entity.Property(e => e.FiberCode)
                    .HasColumnName("fiber_code")
                    .HasConversion(
                        v => v.ToString(),
                        v => (FiberCode)System.Enum.Parse(typeof(FiberCode), v))
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.NetworkType)
                    .HasColumnName("network_type")
                    .HasConversion(
                        v => v.ToString(),
                        v => (EntitiesEnum.OrderContextConstants.NetworkType)System.Enum.Parse(typeof(EntitiesEnum.OrderContextConstants.NetworkType), v))
                    .HasDefaultValueSql("'FIBER'");

            
                entity.HasOne(d => d.CustomerLocation)
                    .WithMany(p => p.Connection)
                    .HasForeignKey(d => d.CustomerLocationId)
                    .HasConstraintName("FK_Connection_CustomerLocation");

            });

         

            modelBuilder.Entity<CustomerLocation>(entity =>
            {
                entity.ToTable("customer_location", "main");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.HouseNumber)
                    .HasColumnName("house_number")
                    .HasColumnType("int(5)");

                entity.Property(e => e.HouseNumberExtension)
                    .HasColumnName("house_number_extension")
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasDefaultValueSql("''");

                entity.Property(e => e.Room)
                    .HasColumnName("room")
                    .HasMaxLength(64)
                    .IsUnicode(false)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.SearchCode)
                    .IsRequired()
                    .HasColumnName("search_code")
                    .HasMaxLength(45)
                    .IsUnicode(false);

                entity.Property(e => e.ZipCode)
                    .IsRequired()
                    .HasColumnName("zip_code")
                    .HasColumnType("char(6)");
            });

            modelBuilder.Entity<Huurder>(entity =>
            {
                entity.ToTable("huurder", "main");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.HeaderId)
                    .IsRequired()
                    .HasColumnName("header_id")
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.HeaderSystemId)
                    .IsRequired()
                    .HasColumnName("header_system_id")
                    .HasMaxLength(15)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<HuurderOrder>(entity =>
            {

                entity.ToTable("huurder_order", "main");

                entity.HasIndex(e => e.ConnectionId)
                    .HasName("fk_HuurderOrder_Connection");

                entity.HasIndex(e => e.HuurderId)
                    .HasName("fk_HuurderOrder_Huurder");

                entity.HasIndex(e => e.WmsId)
                    .HasName("WmsId_UNIQUE")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.ConnectionId)
                    .HasColumnName("connection_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.ExternalOrderUid)
                    .IsRequired()
                    .HasColumnName("external_order_uid")
                    .HasMaxLength(32)
                    .IsUnicode(false);

                entity.Property(e => e.HuurderId)
                    .HasColumnName("huurder_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.WmsId)
                    .HasColumnName("wms_id")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.StartDate).HasColumnName("start_date");

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasDefaultValueSql("NULL")
                    .HasConversion(
                        v => v.ToString(),
                        v => (Status)Enum.Parse(typeof(Status), v));

                entity.HasOne(d => d.Connection)
                    .WithMany(p => p.HuurderOrder)
                    .HasForeignKey(d => d.ConnectionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_HuurderOrder_Connection");

                entity.Property(e => e.LastHistoryId)
                    .HasColumnName("last_history_id")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("NULL");

                entity.HasOne(d => d.LastHistory)
                    .WithMany(p => p.HuurderOrder)
                    .HasForeignKey(d => d.LastHistoryId)
                    .HasConstraintName("fk_HuurderOrder_HuurderOrderHistory");

                entity.HasOne(d => d.Huurder)
                    .WithMany(p => p.HuurderOrder)
                    .HasForeignKey(d => d.HuurderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_HuurderOrder_Huurder");
            });

            modelBuilder.Entity<Unrouted>(entity =>
            {
                entity.ToTable("unrouted_order", "main");

                entity.HasIndex(e => e.WmsId)
                    .HasName("WmsId_UNIQUE")
                    .IsUnique();
                
                entity.Property(e => e.WmsId)
                   .HasColumnName("wms_id")
                   .HasColumnType("bigint(20)");

                entity.Property(e => e.Reason)
                    .HasColumnName("reason")
                    .HasMaxLength(600)
                    .IsUnicode(false)
                    .HasDefaultValueSql("''");
            });

            modelBuilder.Entity<HuurderOrderHistory>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.ToTable("huurder_order_history", "main");
                entity.Property(e => e.EntryTime)
                    .HasColumnName("entry_time")
                    .HasDefaultValueSql("NULL");
            });

            modelBuilder.Entity<OrderSlaType>(entity =>
            {

                entity.ToTable("order_sla_type", "main");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.ConnectionStatus)
                   .HasColumnName("connection_status")
                   .HasColumnType("varchar(10)")
                   .HasDefaultValueSql("NULL");

                entity.Property(e => e.BuildingStatus)
                    .HasColumnName("building_status")
                    .HasColumnType("int(11)");

                entity.Property(e => e.NLType)
                    .HasColumnName("nl_type")
                    .HasConversion(
                        v => v.ToString(),
                        v => (NLType)System.Enum.Parse(typeof(NLType), v));

                entity.Property(e => e.CommentType)
                    .HasColumnName("comment_type")
                    .HasConversion(
                        v => v.ToString(),
                        v => (CommentTypeSla)System.Enum.Parse(typeof(CommentTypeSla), v))
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.IsDefault)
                    .HasColumnName("is_default")
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'");


            });
        }
    }
}
