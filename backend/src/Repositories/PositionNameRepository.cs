using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

public class PositionNameRepository(VirkarekisteriDb db)
{
    public async Task<Guid?> GetPositionNameIdByName(string name)
    {
        var positionName = await db.PositionNames.FirstOrDefaultAsync(pn => pn.Name == name);
        return positionName?.Id;
    }

    public async Task<Guid> CreatePositionName(string name)
    {
        var newPositionName = new PositionName { Name = name };
        await db.PositionNames.AddAsync(newPositionName);
        await db.SaveChangesAsync();
        return newPositionName.Id;
    }
}
