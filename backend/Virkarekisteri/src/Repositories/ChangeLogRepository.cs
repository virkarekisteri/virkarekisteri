using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface IChangeLogRepository
{
    Task<ChangeLog> AddChangeLogEntry(ChangeLog changeLogEntry);
    Task<List<ChangeLog>> GetChangeLogsByPositionId(Guid positionId);
    Task<List<ChangeLog>> GetAllChangeLogs();
}

public class ChangeLogRepository(VirkarekisteriDb db) : IChangeLogRepository
{
    public async Task<ChangeLog> AddChangeLogEntry(ChangeLog changeLogEntry)
    {
        changeLogEntry.Timestamp = DateTime.UtcNow;
        await db.ChangeLogs.AddAsync(changeLogEntry);
        await db.SaveChangesAsync();
        return changeLogEntry;
    }

    public async Task<List<ChangeLog>> GetChangeLogsByPositionId(Guid positionId)
    {
        return await db
            .ChangeLogs.Where(cl => cl.PositionId == positionId)
            .OrderByDescending(cl => cl.Timestamp)
            .ToListAsync();
    }

    public async Task<List<ChangeLog>> GetAllChangeLogs()
    {
        return await db.ChangeLogs.OrderByDescending(c => c.Timestamp).ToListAsync();
    }
}
