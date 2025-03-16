using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface ICRUDChangeLogRepository
{
    Task<CRUDChangeLog> AddCRUDChangeLogEntry(CRUDChangeLog CRUDChangeLogEntry);
    Task<CRUDChangeLog?> GetCRUDChangeLogByObjectId(Guid objectId);
    Task<CRUDChangeLog?> GetCRUDChangeLogByObjectType(string objectType);
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

    public async Task<CRUDChangeLog?> GetCRUDChangeLogByObjectId(Guid objectId)
    {
        return await db.CRUDChangeLogs.FirstOrDefaultAsync(ccl => ccl.ObjectId == objectId);
    }

    public async Task<CRUDChangeLog?> GetCRUDChangeLogByObjectType(string objectType)
    {
        return await db.CRUDChangeLogs.FirstOrDefaultAsync(ccl => ccl.ObjectType == objectType);
    }

    public async Task<List<CRUDChangeLog>> GetAllCRUDChangeLogs()
    {
        return await db.CRUDChangeLogs.OrderByDescending(ccl => ccl.Timestamp).ToListAsync();
    }
}
