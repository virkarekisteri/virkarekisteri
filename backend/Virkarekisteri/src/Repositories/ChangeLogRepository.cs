using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface IChangeLogRepository
{
    Task<ChangeLog> AddChangeLogEntry(ChangeLog changeLogEntry);
    Task<List<ChangeLog>> GetChangeLogsByPositionId(Guid positionId);
}

public class ChangeLogRepository(VirkarekisteriDb db) : IChangeLogRepository
{
    public async Task<ChangeLog> AddChangeLogEntry(ChangeLog changeLogEntry)
    {
        await db.ChangeLogs.AddAsync(changeLogEntry);
        await db.SaveChangesAsync();
        return changeLogEntry;
    }

    public async Task<List<ChangeLog>> GetChangeLogsByPositionId(Guid positionId)
    {
        return await db.ChangeLogs
            .Where(cl => cl.PositionId == positionId)
            .ToListAsync();
    }
}

