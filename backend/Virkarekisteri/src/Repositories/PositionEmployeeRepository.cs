using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface IPositionEmployeeRepository
{
    Task<bool> IsPositionFilled(Guid virkaId, DateTime startDate);
    Task<bool> IsPositionValid(Guid virkaId, DateTime startDate);
    Task<PositionEmployee> CreatePositionEmployee(PositionEmployee positionEmployee);
    Task<PositionEmployee?> GetPositionEmployee(Guid id);
}

public class PositionEmployeeRepository(VirkarekisteriDb db) : IPositionEmployeeRepository
{
    public async Task<bool> IsPositionFilled(Guid positionId, DateTime startDate)
    {
        return await db.PositionEmployees.AnyAsync(pe =>
            pe.PositionId == positionId && (pe.EndingDate > startDate || pe.EndingDate == null)
        );
    }

    public async Task<bool> IsPositionValid(Guid positionId, DateTime startDate)
    {
        var position = await db.Positions.FirstOrDefaultAsync(p =>
            p.Id == positionId && (p.EndedAt == null || p.EndedAt >= startDate)
        );
        return position != null;
    }

    public async Task<PositionEmployee> CreatePositionEmployee(PositionEmployee newPositionEmployee)
    {
        await db.PositionEmployees.AddAsync(newPositionEmployee);
        await db.SaveChangesAsync();
        return newPositionEmployee;
    }
    public async Task<PositionEmployee?> GetPositionEmployee(Guid id)
    {
        return await db.PositionEmployees.FirstOrDefaultAsync(pe => pe.Id == id);
    }
}
