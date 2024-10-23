using Microsoft.EntityFrameworkCore;

namespace Virkarekisteri.Models;

public class VirkarekisteriDb(DbContextOptions<VirkarekisteriDb> options) : DbContext(options)
{
    public DbSet<Position> Positions => Set<Position>();
    public DbSet<PositionName> PositionNames { get; set; }
}
