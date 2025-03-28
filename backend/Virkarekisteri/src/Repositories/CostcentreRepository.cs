using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface ICostcentreRepository
{
    Task<List<Costcentre>> GetAllCostcentres();
    Task<string?> GetCostcentreNameById(Guid id);
    Task<Costcentre> GetCostcentreById(Guid id);
    Task<(bool Exists, Costcentre? Costcentre)> CreateCostcentre(Costcentre costcentre);
    Task UpdateCostcentre(Costcentre existingCostcentre);
}

public class CostcentreRepository(VirkarekisteriDb db) : ICostcentreRepository
{
    public async Task<List<Costcentre>> GetAllCostcentres()
    {
        return await db.Costcentres.ToListAsync();
    }

    public async Task<Costcentre> GetCostcentreById(Guid id)
    {
        return await db.Costcentres.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<string?> GetCostcentreNameById(Guid id)
    {
        var costcentre = await db.Costcentres.FirstOrDefaultAsync(c => c.Id == id);
        return costcentre?.Name;
    }

    public async Task<(bool Exists, Costcentre? Costcentre)> CreateCostcentre(Costcentre costcentre)
    {
        // Check if a costcentre with the same name exists
        var existingCostcentre = await db.Costcentres.FirstOrDefaultAsync(c => c.Name == costcentre.Name);

        if (existingCostcentre != null)
        {
            return (true, existingCostcentre); // Return that it already exists
        }

        // Check if a costcentre with the same number exists
        existingCostcentre = await db.Costcentres.FirstOrDefaultAsync(c => c.Number == costcentre.Number);

        if (existingCostcentre != null)
        {
            return (true, existingCostcentre); // Return that it already exists
        }

        // Add the new costcentre if it does not exist
        db.Costcentres.Add(costcentre);
        await db.SaveChangesAsync();
        return (false, costcentre);
    }

    public async Task UpdateCostcentre(Costcentre existingCostcentre)
    {
        db.Costcentres.Update(existingCostcentre);
        await db.SaveChangesAsync();
    }
}
