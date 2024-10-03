using Microsoft.EntityFrameworkCore;

namespace Virkarekisteri.Models;

public class VirkarekisteriDb(DbContextOptions<VirkarekisteriDb> options) : DbContext(options);
