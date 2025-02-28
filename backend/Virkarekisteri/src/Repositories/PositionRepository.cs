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

            // Fetch the subject IDs for the position from the junction table
            position.SubjectIds = await db
                .PositionSubjects.Where(ps => ps.PositionId == position.Id)
                .Select(ps => ps.SubjectId)
                .ToListAsync();
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
        var position = await db.Positions.Include(p => p.PositionName).FirstOrDefaultAsync(p => p.Id == id);

        if (position == null)
            return null;

        // Fetch the subject IDs for the position from the junction table
        position.SubjectIds = await db
            .PositionSubjects.Where(ps => ps.PositionId == id)
            .Select(ps => ps.SubjectId)
            .ToListAsync();

        return position;
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

        // Save the position first to get the ID
        await db.Positions.AddAsync(position);
        await db.SaveChangesAsync();

        // Save the subject IDs to the junction table
        if (position.SubjectIds != null && position.SubjectIds.Any())
        {
            var positionSubjects = position
                .SubjectIds.Select(subjectId => new PositionSubject { PositionId = position.Id, SubjectId = subjectId })
                .ToList();

            await db.PositionSubjects.AddRangeAsync(positionSubjects);
            await db.SaveChangesAsync();
        }

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
        // Update the position details
        db.Positions.Update(existingPosition);
        await db.SaveChangesAsync();

        // Remove old subjects that are no longer linked
        await db
            .PositionSubjects.Where(ps =>
                ps.PositionId == existingPosition.Id && !existingPosition.SubjectIds.Contains(ps.SubjectId)
            )
            .ExecuteDeleteAsync();

        // Add new subjects that are not yet linked
        var existingSubjectIds = await db
            .PositionSubjects.Where(ps => ps.PositionId == existingPosition.Id)
            .Select(ps => ps.SubjectId)
            .ToListAsync();

        var newSubjectIds = existingPosition
            .SubjectIds.Except(existingSubjectIds)
            .Select(subjectId => new PositionSubject { PositionId = existingPosition.Id, SubjectId = subjectId })
            .ToList();

        if (newSubjectIds.Any())
        {
            await db.PositionSubjects.AddRangeAsync(newSubjectIds);
            await db.SaveChangesAsync();
        }
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
