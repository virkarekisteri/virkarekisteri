using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface IPositionRepository
{
    Task<List<Position>> GetPositions();
    Task<Position?> GetPosition(Guid id);
    Task<Position> CreatePosition(Position position);
    Task UpdatePosition(Position existingPosition);
    Task<Guid> GetOrgTreeIdByNumber(string number);
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
        return await db
            .Positions.Include(p => p.PositionName)
            .Include(p => p.PositionSubjects) // Junction table
            .ThenInclude(ps => ps.Subject) // Subjects
            .FirstOrDefaultAsync(p => p.Id == id);
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

        position.PositionSubjects ??= new List<PositionSubject>();

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

    public async Task<Guid> GetOrgTreeIdByNumber(string number)
    {
        var orgTree = await db.OrganizationTrees.FirstOrDefaultAsync(o => o.Number == number);

        return orgTree?.Id ?? Guid.Empty;
    }

    /// <summary>
    /// Gets the organization number (prefix) for the given OrgTreeId.
    /// </summary>
    /// <param name="orgTreeId">The organization tree node ID.</param>
    /// <returns>The organization number, or null if not found.</returns>
    public async Task<string?> GetOrgNumberById(Guid orgTreeId)
    {
        return await db.OrganizationTrees.Where(o => o.Id == orgTreeId).Select(o => o.Number).FirstOrDefaultAsync();
    }

    /// <summary>
    /// Gets the vacancy number with the specified prefix.
    /// </summary>
    /// <param name="prefix">The prefix for filtering vacancy numbers.</param>
    /// <returns>The latest vacancy number, or null if not found.</returns>
    public async Task<string?> GetLatestVacancyNumberByPrefix(string prefix)
    {
        return await db
            .Positions.Where(p => p.VacancyNumber != null && p.VacancyNumber.StartsWith(prefix))
            .OrderByDescending(p => p.VacancyNumber)
            .Select(p => p.VacancyNumber)
            .FirstOrDefaultAsync();
    }

    /// <summary>
    /// Generates a unique vacancy number based on the OrgTreeId and the next sequence number.
    /// </summary>
    /// <param name="orgTreeId">The organization tree node ID.</param>
    /// <returns>A new vacancy number in the format "PREFIXXXXX".</returns>
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
