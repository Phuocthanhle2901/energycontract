using Microsoft.EntityFrameworkCore;
using static DomainModel.Enum.OrderSlaEnum;

namespace Entities.Sla
{
    public class SlaContext : DbContext
    {
        public SlaContext()
        {
        }

        public SlaContext(DbContextOptions<SlaContext> options)
            : base(options)
        {
        }

        public virtual DbSet<BreachCalculation> BreachCalculation { get; set; }
        public virtual DbSet<CalculationObject> CalculationObject { get; set; }
        public virtual DbSet<Calendar> Calendar { get; set; }
        public virtual DbSet<CalendarDay> CalendarDay { get; set; }
        public virtual DbSet<Rule> Rule { get; set; }
        public virtual DbSet<RuleCalculationObjects> RuleCalculationObjects { get; set; }
        public virtual DbSet<RulePrimitivedataConditions> RulePrimitivedataConditions { get; set; }
        public virtual DbSet<SchemaVersion> SchemaVersion { get; set; }
        public virtual DbSet<SlaTimer> SlaTimer { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                // optionsBuilder.UseMySQL("Server=192.168.2.181;port=3306;Database=sla;User=root;Password=info123456;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BreachCalculation>(entity =>
            {
                entity.ToTable("breach_calculation");

                entity.HasIndex(e => e.CalculationObjectId)
                    .HasName("FK_calculation_object");

                entity.HasIndex(e => e.RuleId)
                    .HasName("FK_rule_breach_calculation");

                entity.HasIndex(e => e.SlaTimerId)
                    .HasName("FK_calculation_slatimer");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.CalculationObjectId)
                    .HasColumnName("calculation_object_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("created_date")
                    .HasColumnType("datetime");

                entity.Property(e => e.DueDate)
                    .HasColumnName("due_date")
                    .HasColumnType("datetime");

                entity.Property(e => e.DurationHold)
                    .HasColumnName("duration_hold")
                    .HasColumnType("int(11)");

                entity.Property(e => e.EndHold)
                    .HasColumnName("end_hold")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsSync)
                    .HasColumnName("is_sync")
                    .HasColumnType("tinyint(1)");

                entity.Property(e => e.RuleId)
                    .HasColumnName("rule_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.SlaTimerId)
                    .HasColumnName("sla_timer_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.StartHold)
                    .HasColumnName("start_hold")
                    .HasColumnType("datetime");

                entity.Property(e => e.UpdatedDate)
                    .HasColumnName("updated_date")
                    .HasColumnType("datetime");

                entity.HasOne(d => d.CalculationObject)
                    .WithMany(p => p.BreachCalculation)
                    .HasForeignKey(d => d.CalculationObjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_calculation_object");

                entity.HasOne(d => d.Rule)
                    .WithMany(p => p.BreachCalculation)
                    .HasForeignKey(d => d.RuleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_rule_breach_calculation");

                entity.HasOne(d => d.SlaTimer)
                    .WithMany(p => p.BreachCalculation)
                    .HasForeignKey(d => d.SlaTimerId)
                    .HasConstraintName("FK_calculation_slatimer");
            });

            modelBuilder.Entity<CalculationObject>(entity =>
            {
                entity.ToTable("calculation_object");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("created_date")
                    .HasColumnType("datetime");

                entity.Property(e => e.UpdateDate)
                    .HasColumnName("update_date")
                    .HasColumnType("datetime");

                entity.Property(e => e.WmsId)
                    .HasColumnName("wms_id")
                    .HasColumnType("bigint(11)");
            });

            modelBuilder.Entity<Calendar>(entity =>
            {
                entity.ToTable("calendar");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .HasColumnType("varchar(1028)");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasColumnType("varchar(255)");
            });

            modelBuilder.Entity<CalendarDay>(entity =>
            {
                entity.ToTable("calendar_day");

                entity.HasIndex(e => e.CalendarId)
                    .HasName("fk_calendar_day_calendar");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.CalendarId)
                    .HasColumnName("calendar_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IsHoliday)
                    .HasColumnName("is_holiday")
                    .HasColumnType("tinyint(1)");

                entity.Property(e => e.Note)
                    .HasColumnName("note")
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.WorkDuration)
                    .HasColumnName("work_duration")
                    .HasColumnType("int(255)");

                entity.Property(e => e.WorkEnd).HasColumnName("work_end");

                entity.Property(e => e.WorkStart).HasColumnName("work_start");

                entity.HasOne(d => d.Calendar)
                    .WithMany(p => p.CalendarDay)
                    .HasForeignKey(d => d.CalendarId)
                    .HasConstraintName("fk_calendar_day_calendar");
            });

            modelBuilder.Entity<Rule>(entity =>
            {
                entity.ToTable("rule");

                entity.HasIndex(e => e.Calendar)
                    .HasName("FK_rule_calendar");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Calendar)
                    .HasColumnName("calendar")
                    .HasColumnType("int(255)");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("created_date")
                    .HasColumnType("datetime");

                entity.Property(e => e.End).HasColumnName("end");

                entity.Property(e => e.PartyName)
                    .HasColumnName("party_name")
                    .HasColumnType("varchar(255)")
                    .HasDefaultValueSql("''");

                entity.Property(e => e.PartySystem)
                    .HasColumnName("party_system")
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.RuleName)
                    .IsRequired()
                    .HasColumnName("rule_name")
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.Start).HasColumnName("start");

                entity.Property(e => e.ThresHold)
                    .HasColumnName("thres_hold")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Rule_nr)
                    .HasColumnName("rule_nr")
                    .HasColumnType("int(11)");

                entity.Property(e => e.UpdatedDate)
                    .HasColumnName("updated_date")
                    .HasColumnType("datetime");

                entity.Property(e => e.Domain)
                    .HasColumnName("domain")
                    .HasConversion(
                        v => v.ToString(),
                        v => (Domain)System.Enum.Parse(typeof(Domain), v))
                    .HasDefaultValueSql("Fulfillment");

                entity.Property(e => e.Priority)
                   .HasColumnName("priority")
                   .HasConversion(
                       v => v.ToString(),
                       v => (Priority)System.Enum.Parse(typeof(Priority), v));

                entity.Property(e => e.NetworkType)
                   .HasColumnName("network_type")
                   .HasConversion(
                       v => v.ToString(),
                       v => (NetworkType)System.Enum.Parse(typeof(NetworkType), v));

                entity.Property(e => e.SlaDirection)
                  .HasColumnName("sla_direction")
                  .HasConversion(
                      v => v.ToString(),
                      v => (SlaDirection)System.Enum.Parse(typeof(SlaDirection), v));

                entity.Property(e => e.MeasureUnit)
                  .HasColumnName("measure_unit")
                  .HasConversion(
                      v => v.ToString(),
                      v => (MeasurementUnit)System.Enum.Parse(typeof(MeasurementUnit), v));

                entity.Property(e => e.RuleType)
                 .HasColumnName("rule_type")
                 .HasConversion(
                     v => v.ToString(),
                     v => (RuleType)System.Enum.Parse(typeof(RuleType), v));

                entity.HasOne(d => d.CalendarNavigation)
                    .WithMany(p => p.Rule)
                    .HasForeignKey(d => d.Calendar)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_rule_calendar");
            });

            modelBuilder.Entity<RuleCalculationObjects>(entity =>
            {
                entity.ToTable("rule_calculation_objects");

                entity.HasIndex(e => e.CalculationObjectId)
                    .HasName("fk_reference_calculation_object");

                entity.HasIndex(e => e.RuleId)
                    .HasName("fk_reference_rule");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.CalculationObjectId)
                    .HasColumnName("calculation_object_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.RuleId)
                    .HasColumnName("rule_id")
                    .HasColumnType("int(11)");

                entity.HasOne(d => d.CalculationObject)
                    .WithMany(p => p.RuleCalculationObjects)
                    .HasForeignKey(d => d.CalculationObjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_reference_calculation_object");

                entity.HasOne(d => d.Rule)
                    .WithMany(p => p.RuleCalculationObjects)
                    .HasForeignKey(d => d.RuleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_reference_rule");
            });

            modelBuilder.Entity<RulePrimitivedataConditions>(entity =>
            {
                entity.ToTable("rule_primitivedata_conditions");

                entity.HasIndex(e => e.SlaRuleId)
                    .HasName("fk_sla_rule_additional_conditions_sla_rule");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.FieldName)
                    .IsRequired()
                    .HasColumnName("field_name")
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.IsNullIgnore)
                    .HasColumnName("is_null_ignore")
                    .HasColumnType("tinyint(1)");

                entity.Property(e => e.MappingClass)
                    .IsRequired()
                    .HasColumnName("mapping_class")
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.MappingNamespace)
                    .IsRequired()
                    .HasColumnName("mapping_namespace")
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.MappingPackage)
                    .IsRequired()
                    .HasColumnName("mapping_package")
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.SlaRuleId)
                    .HasColumnName("sla_rule_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Value)
                    .HasColumnName("value")
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.DataType)
                  .HasColumnName("data_type")
                  .HasConversion(
                      v => v.ToString().ToLower(),
                      v => (DataTypeRule)System.Enum.Parse(typeof(DataTypeRule), v.ToUpper()));

                entity.Property(e => e.Version)
                    .IsRequired()
                    .HasColumnName("version")
                    .HasColumnType("varchar(255)");

                entity.HasOne(d => d.SlaRule)
                    .WithMany(p => p.RulePrimitivedataConditions)
                    .HasForeignKey(d => d.SlaRuleId)
                    .HasConstraintName("fk_sla_rule_additional_conditions_sla_rule");
            });

            modelBuilder.Entity<SchemaVersion>(entity =>
            {
                entity.HasKey(e => e.Version)
                    .HasName("PRIMARY");

                entity.ToTable("schema_version");

                entity.HasIndex(e => e.InstalledRank)
                    .HasName("schema_version_ir_idx");

                entity.HasIndex(e => e.Success)
                    .HasName("schema_version_s_idx");

                entity.HasIndex(e => e.VersionRank)
                    .HasName("schema_version_vr_idx");

                entity.Property(e => e.Version)
                    .HasColumnName("version")
                    .HasColumnType("varchar(50)");

                entity.Property(e => e.Checksum)
                    .HasColumnName("checksum")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("description")
                    .HasColumnType("varchar(200)");

                entity.Property(e => e.ExecutionTime)
                    .HasColumnName("execution_time")
                    .HasColumnType("int(11)");

                entity.Property(e => e.InstalledBy)
                    .IsRequired()
                    .HasColumnName("installed_by")
                    .HasColumnType("varchar(100)");

                entity.Property(e => e.InstalledOn)
                    .HasColumnName("installed_on")
                    .HasColumnType("timestamp")
                    .HasDefaultValueSql("'current_timestamp()'");

                entity.Property(e => e.InstalledRank)
                    .HasColumnName("installed_rank")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Script)
                    .IsRequired()
                    .HasColumnName("script")
                    .HasColumnType("varchar(1000)");

                entity.Property(e => e.Success)
                    .HasColumnName("success")
                    .HasColumnType("tinyint(1)");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasColumnType("varchar(20)");

                entity.Property(e => e.VersionRank)
                    .HasColumnName("version_rank")
                    .HasColumnType("int(11)");
            });

            modelBuilder.Entity<SlaTimer>(entity =>
            {
                entity.ToTable("sla_timer");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.BreachId)
                    .HasColumnName("breach_id")
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.WarningId)
                    .HasColumnName("warning_id")
                    .HasColumnType("varchar(255)");
            });
        }
    }
}
