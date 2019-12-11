using Microsoft.EntityFrameworkCore;

namespace Entities.CoconMapping
{
    public class FulfillmentConfigContext : DbContext
    {
        public FulfillmentConfigContext()
        {
        }

        public FulfillmentConfigContext(DbContextOptions<FulfillmentConfigContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CoconMapping> CoconMapping { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySQL("server=192.168.2.181;port=3306;user=root;password=info123456;database=fulfillment_config");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CoconMapping>(entity =>
            {
                entity.ToTable("cocon_mapping", "fulfillment_config");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.CoconName)
                    .IsRequired()
                    .HasColumnName("cocon_name")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.WmsName)
                    .IsRequired()
                    .HasColumnName("wms_name")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.WmsSystemName)
                    .IsRequired()
                    .HasColumnName("wms_system_name")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });
        }
    }
}
