using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;
using Virkarekisteri.Utils;

namespace Virkarekisteri.Repositories;

public interface IPositionRepository
{
    Task<List<Position>> GetPositions();
    Task<Position?> GetPosition(Guid id);
    Task<Position> CreatePosition(Position position);
    Task UpdatePosition(Position existingPosition);
}

public class PositionRepository(VirkarekisteriDb db, VacancyNumberGenerator vacancyNumberGenerator) : IPositionRepository
{
    /// <summary>
    /// Gets all Positions from the database. If any Position is missing a VacancyNumber, generates one.
    /// </summary>
    /// <returns>List of all Positions</returns>
    public async Task<List<Position>> GetPositions()
    {
        var positions = await db.Positions.Include(p => p.PositionName).ToListAsync();

        // Generate missing VacancyNumber values
        foreach (var position in positions)
        {
            if (string.IsNullOrWhiteSpace(position.VacancyNumber))
            {
                position.VacancyNumber = await vacancyNumberGenerator.GenerateVacancyNumber(position.OrgTreeId);
                db.Positions.Update(position);
            }
        }

        await db.SaveChangesAsync();
        return positions;
    }

    /// <summary>
    /// Gets a Position by ID from the database
    /// </summary>
    /// <param name="id">Id to get by</param>
    /// <returns>The requests Position</returns>
    public async Task<Position?> GetPosition(Guid id)
    {
        return await db.Positions.Include(p => p.PositionName).FirstOrDefaultAsync(p => p.Id == id);
    }

    /// <summary>
    /// Creates (inserts to the Positions table) a Position to the database. Generates a VacancyNumber if missing.
    /// </summary>
    /// <param name="position">Position to create</param>
    /// <returns>The created Position</returns>
    public async Task<Position> CreatePosition(Position position)
    {
        // Generate VacancyNumber if it's missing
        if (string.IsNullOrWhiteSpace(position.VacancyNumber))
        {
            position.VacancyNumber = await vacancyNumberGenerator.GenerateVacancyNumber(position.OrgTreeId);
        }

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
