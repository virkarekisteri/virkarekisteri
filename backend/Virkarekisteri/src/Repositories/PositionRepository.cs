using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface IPositionRepository
{
    Task<List<Position>> GetPositions();
    Task<Position?> GetPosition(Guid id);
    Task<Position> CreatePosition(Position position);
    Task UpdatePosition(Position existingPosition);
    Task<string?> GetOrgNumberById(Guid orgTreeId);
    Task<string?> GetLatestVacancyNumberByPrefix(string prefix);
    Task<string> GenerateVacancyNumber(Guid orgTreeId);
}

public class PositionRepository(VirkarekisteriDb db) : IPositionRepository
{
    /// <summary>
    /// Gets all Positions from the database. If any Position is missing a VacancyNumber, generates one.
    /// </summary>
    /// <returns>List of all Positions</returns>
    public async Task<List<Position>> GetPositions()
    {
        var positions = await db.Positions.Include(p => p.PositionName).ToListAsync();

        foreach (var position in positions)
        {
            if (string.IsNullOrWhiteSpace(position.VacancyNumber))
            {
                position.VacancyNumber = await GenerateVacancyNumber(position.OrgTreeId);
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
        if (string.IsNullOrWhiteSpace(position.VacancyNumber))
        {
            position.VacancyNumber = await GenerateVacancyNumber(position.OrgTreeId);
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

    /// <summary>
    /// Gets the organization number for the given OrgTreeId.
    /// </summary>
    public async Task<string?> GetOrgNumberById(Guid orgTreeId)
    {
        return await db.OrganizationTrees.Where(o => o.Id == orgTreeId).Select(o => o.Number).FirstOrDefaultAsync();
    }

    /// <summary>
    /// Gets the latest vacancy number with the given prefix.
    /// </summary>
    public async Task<string?> GetLatestVacancyNumberByPrefix(string prefix)
    {
        return await db
            .Positions.Where(p => p.VacancyNumber != null && p.VacancyNumber.StartsWith(prefix))
            .OrderByDescending(p => p.VacancyNumber)
            .Select(p => p.VacancyNumber)
            .FirstOrDefaultAsync();
    }

    public async Task<string> GenerateVacancyNumber(Guid orgTreeId)
    {
        var orgNumber = await GetOrgNumberById(orgTreeId);
        string vacancyPrefix = orgNumber ?? "";

        var latestVacancyNumber = await GetLatestVacancyNumberByPrefix(vacancyPrefix);

        int nextSequenceNumber =
            latestVacancyNumber != null ? int.Parse(latestVacancyNumber.Substring(vacancyPrefix.Length)) + 1 : 0;

        return vacancyPrefix + nextSequenceNumber.ToString("D4");
    }
}
