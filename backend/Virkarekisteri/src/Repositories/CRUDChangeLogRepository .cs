using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface ICRUDChangeLogRepository
{
    Task<CRUDChangeLog> AddCRUDChangeLogEntry(CRUDChangeLog CRUDChangeLogEntry);
    Task<List<CRUDChangeLog>> GetCRUDChangeLogsByObjectId(Guid objectId);
    Task<List<CRUDChangeLog>> GetCRUDChangeLogsByObjectType(string objectType);
    Task<List<CRUDChangeLog>> GetAllCRUDChangeLogs();
}

public class CRUDChangeLogRepository(VirkarekisteriDb db) : ICRUDChangeLogRepository
{
    public async Task<CRUDChangeLog> AddCRUDChangeLogEntry(CRUDChangeLog CRUDChangeLogEntry)
    {
        CRUDChangeLogEntry.Timestamp = DateTime.UtcNow.ToLocalTime();
        await db.CRUDChangeLogs.AddAsync(CRUDChangeLogEntry);
        await db.SaveChangesAsync();
        return CRUDChangeLogEntry;
    }

    public async Task<List<CRUDChangeLog>> GetCRUDChangeLogsByObjectId(Guid objectId)
    {
        return await db
            .CRUDChangeLogs.Where(cl => cl.ObjectId == objectId)
            .OrderByDescending(cl => cl.Timestamp)
            .ToListAsync();
    }

    public async Task<List<CRUDChangeLog>> GetCRUDChangeLogsByObjectType(string objectType)
    {
        return await db
            .CRUDChangeLogs.Where(cl => cl.ObjectType == objectType)
            .OrderByDescending(cl => cl.Timestamp)
            .ToListAsync();
    }

    public async Task<List<CRUDChangeLog>> GetAllCRUDChangeLogs()
    {
        return await db.CRUDChangeLogs.OrderByDescending(ccl => ccl.Timestamp).ToListAsync();
    }
}
