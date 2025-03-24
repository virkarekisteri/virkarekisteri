using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface IPositionChangeLogRepository
{
    Task<PositionChangeLog> AddPositionChangeLogEntry(PositionChangeLog positionChangeLogEntry);
    Task<List<PositionChangeLog>> GetPositionChangeLogsByPositionId(Guid positionId);
    Task<List<PositionChangeLog>> GetAllPositionChangeLogs();
}

public class PositionChangeLogRepository(VirkarekisteriDb db) : IPositionChangeLogRepository
{
    public async Task<PositionChangeLog> AddPositionChangeLogEntry(PositionChangeLog positionChangeLogEntry)
    {
        positionChangeLogEntry.Timestamp = DateTime.UtcNow.ToLocalTime();
        await db.PositionChangeLogs.AddAsync(positionChangeLogEntry);
        await db.SaveChangesAsync();
        return positionChangeLogEntry;
    }

    public async Task<List<PositionChangeLog>> GetPositionChangeLogsByPositionId(Guid positionId)
    {
        return await db
            .PositionChangeLogs.Where(cl => cl.PositionId == positionId)
            .OrderByDescending(cl => cl.Timestamp)
            .ToListAsync();
    }

    public async Task<List<PositionChangeLog>> GetAllPositionChangeLogs()
    {
        return await db.PositionChangeLogs.OrderByDescending(c => c.Timestamp).ToListAsync();
    }
}
