using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Entites.Models
{
    public partial class ExportProjectContext : DbContext
    {
        public ExportProjectContext()
        {
        }

        public ExportProjectContext(DbContextOptions<ExportProjectContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Employee> Employee { get; set; }
        public virtual DbSet<Stores> Stores { get; set; }
        public DbQuery<ViewExport> ViewExports { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySQL("server=localhost;port=3306;user=root;password=123456;database=exportproject");
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("employee", "exportproject");

                entity.Property(e => e.EmployeeId)
                    .HasColumnName("employeeId")
                    .HasColumnType("int(11)")
                    .ValueGeneratedNever();

                entity.Property(e => e.Gender)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasDefaultValueSql("NULL");
            });

            modelBuilder.Entity<Stores>(entity =>
            {
                entity.HasKey(e => e.Storeid);

                entity.ToTable("stores", "exportproject");

                entity.Property(e => e.Storeid)
                    .HasColumnName("storeid")
                    .HasColumnType("int(255)")
                    .ValueGeneratedNever();

                entity.Property(e => e.City)
                    .HasColumnName("city")
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.EmployeeId)
                    .HasColumnName("employeeId")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Phone)
                    .HasColumnName("phone")
                    .IsUnicode(false)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.State)
                    .HasColumnName("state")
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.Storename)
                    .HasColumnName("storename")
                    .IsUnicode(false)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.Street)
                    .HasColumnName("street")
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.Zipcode)
                    .HasColumnName("zipcode")
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasDefaultValueSql("NULL");
            });
            modelBuilder
             .Query<ViewExport>(entity =>
             {
                 entity.ToView("viewexport");

                 entity.Property(e => e.Name)
                 .HasColumnName("Name");

                 entity.Property(e => e.Gender)
                 .HasColumnName("Gender");

                 entity.Property(e => e.Phone)
                 .HasColumnName("Phone");

                 entity.Property(e => e.StoreName)
                 .HasColumnName("StoreName");

                 entity.Property(e => e.Street)
                 .HasColumnName("Street");
             });
        }
    }
}
