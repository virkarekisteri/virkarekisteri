using Microsoft.EntityFrameworkCore;

namespace Virkarekisteri.Models;

public class VirkarekisteriDb(DbContextOptions<VirkarekisteriDb> options) : DbContext(options)
{
    public DbSet<Position> Positions => Set<Position>();
    public DbSet<PositionName> PositionNames { get; set; }
    public DbSet<OrganizationTree> OrganizationTrees { get; set; }
    public DbSet<PositionEmployee> PositionEmployees { get; set; }
    public DbSet<PositionChangeLog> PositionChangeLogs { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<PositionSubject> PositionSubjects { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PositionSubject>().ToTable("PositionSubject");

        // Many-to-many relationship between Position and Subject
        modelBuilder.Entity<PositionSubject>().HasKey(ps => new { ps.PositionId, ps.SubjectId }); // PK

        modelBuilder
            .Entity<PositionSubject>()
            .HasOne(ps => ps.Position)
            .WithMany()
            .HasForeignKey(ps => ps.PositionId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_PositionSubject_Positions");

        modelBuilder
            .Entity<PositionSubject>()
            .HasOne(ps => ps.Subject)
            .WithMany()
            .HasForeignKey(ps => ps.SubjectId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_PositionSubject_Subjects");
    }
}
