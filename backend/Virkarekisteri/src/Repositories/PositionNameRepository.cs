using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface IPositionNameRepository
{
    Task<Guid?> GetPositionNameIdByName(string name);
    Task<string?> GetPositionNameNameById(Guid id);
    Task<(bool Exists, PositionName? PositionName)> CreatePositionName(PositionName positionName);
    Task<List<PositionName>> GetAllPositionNames();
    Task UpdatePositionName(PositionName existingPositionName);
    Task<PositionName> GetPositionNameById(Guid id);
}

public class PositionNameRepository(VirkarekisteriDb db) : IPositionNameRepository
{
    public async Task<PositionName> GetPositionNameById(Guid id)
    {
        return await db.PositionNames.FirstOrDefaultAsync(pn => pn.Id == id);
    }

    public async Task<Guid?> GetPositionNameIdByName(string name)
    {
        var positionName = await db.PositionNames.FirstOrDefaultAsync(pn => pn.Name == name);
        return positionName?.Id;
    }

    public async Task<string?> GetPositionNameNameById(Guid id)
    {
        var positionName = await db.PositionNames.FirstOrDefaultAsync(pn => pn.Id == id);
        return positionName?.Name;
    }

    public async Task<(bool Exists, PositionName? PositionName)> CreatePositionName(PositionName positionName)
    {
        // Check if a position name with the same name exists
        var existingPositionName = await db.PositionNames.FirstOrDefaultAsync(pn => pn.Name == positionName.Name);

        if (existingPositionName != null)
        {
            return (true, existingPositionName); // Return that it already exists
        }

        // Add the new position name if it does not exist
        db.PositionNames.Add(positionName);
        await db.SaveChangesAsync();
        return (false, positionName);
    }

    public async Task<List<PositionName>> GetAllPositionNames()
    {
        return await db.PositionNames.ToListAsync();
    }

    public async Task UpdatePositionName(PositionName existingPositionName)
    {
        db.PositionNames.Update(existingPositionName);
        await db.SaveChangesAsync();
    }
}
