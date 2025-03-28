using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface IPositionNameRepository
{
    Task<Guid?> GetPositionNameIdByName(string name);
    Task<string?> GetPositionNameById(Guid id);
    Task<Guid> CreatePositionName(string name, DateTime validFrom, DateTime validUntil);
    Task<List<PositionName>> GetAllPositionNames();
    Task UpdatePositionName(PositionName existingPositionName);
}

public class PositionNameRepository(VirkarekisteriDb db) : IPositionNameRepository
{
    public async Task<Guid?> GetPositionNameIdByName(string name)
    {
        var positionName = await db.PositionNames.FirstOrDefaultAsync(pn => pn.Name == name);
        return positionName?.Id;
    }

    public async Task<string?> GetPositionNameById(Guid id)
    {
        var positionName = await db.PositionNames.FirstOrDefaultAsync(pn => pn.Id == id);
        return positionName?.Name;
    }

    public async Task<Guid> CreatePositionName(string name, DateTime validFrom, DateTime validUntil)
    {
        var newPositionName = new PositionName
        {
            Name = name,
            ValidFrom = validFrom,
            ValidUntil = validUntil,
        };
        await db.PositionNames.AddAsync(newPositionName);
        await db.SaveChangesAsync();
        return newPositionName.Id;
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
