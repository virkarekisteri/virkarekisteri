using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface ICostcentreRepository
{
    Task<List<Costcentre>> GetAllCostcentres();
    Task<string?> GetCostcentreNameById(Guid id);
}

public class CostcentreRepository(VirkarekisteriDb db) : ICostcentreRepository
{
    public async Task<List<Costcentre>> GetAllCostcentres()
    {
        return await db.Costcentres.ToListAsync();
    }

    public async Task<string?> GetCostcentreNameById(Guid id)
    {
        var costcentre = await db.Costcentres.FirstOrDefaultAsync(c => c.Id == id);
        return costcentre?.Name;
    }
}
