using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public class PositionRepository(VirkarekisteriDb db)
{
    /// <summary>
    /// Gets all Posititons from the database
    /// </summary>
    /// <returns>List of all Positions</returns>
public async Task<List<Position>> GetPositions()
    {
        return await db.Positions
                        .Include(p => p.PositionName)
                        .ToListAsync();
    }

    /// <summary>
    /// Gets a Position by ID from the database
    /// </summary>
    /// <param name="id">Id to get by</param>
    /// <returns>The requests Position</returns>
   public async Task<Position?> GetPosition(Guid id)
    {
        return await db.Positions
                        .Include(p => p.PositionName)
                        .FirstOrDefaultAsync(p => p.Id == id);
    }

    /// <summary>
    /// Creates (inserts to the Positions table) a Position to the database
    /// </summary>
    /// <param name="position">Position to create</param>
    /// <returns>The created position</returns>
    public async Task<Position> CreatePosition(Position position)
    {
        await db.Positions.AddAsync(position);
        await db.SaveChangesAsync();
        return position;
    }

    /// <summary>
    /// Updates an existing Position in the database with the specified changes.
    /// This method marks the Position as modified and saves the changes to the database.
    /// </summary>
    /// <param name="existingPosition">The Position object containing updated values to save.</param>
    /// <returns></returns>
    public async Task UpdatePosition(Position existingPosition)
    {
        db.Positions.Update(existingPosition);
        await db.SaveChangesAsync();
    }
}
