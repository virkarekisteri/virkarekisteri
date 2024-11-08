using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Utils;

public class VacancyNumberGenerator
{
    private readonly VirkarekisteriDb db;

    public VacancyNumberGenerator(VirkarekisteriDb db)
    {
        this.db = db;
    }

    /// <summary>
    /// Generates a unique vacancy number based on the OrgTreeId
    /// </summary>
    /// <param name="orgTreeId">The OrgTreeId used to generate the prefix for the vacancy number </param>
    /// <returns>A unique vacancy number string </returns>
    public async Task<string> GenerateVacancyNumber(Guid orgTreeId)
    {
        // Get the organization number (cost center number / kustannuspaikka) associated with the OrgTreeId
        var orgNumber = await db
            .OrganizationTrees.Where(o => o.Id == orgTreeId)
            .Select(o => o.Number)
            .FirstOrDefaultAsync();

        string vacancyPrefix = orgNumber ?? "";

        // Get the most recent vacancy number with the same prefix if there is
        var latestVacancyNumber = await db
            .Positions.Where(p => p.VacancyNumber.StartsWith(vacancyPrefix))
            .OrderByDescending(p => p.VacancyNumber)
            .Select(p => p.VacancyNumber)
            .FirstOrDefaultAsync();

        // Determine the next sequential number
        var nextSequenceNumber =
            latestVacancyNumber != null ? int.Parse(latestVacancyNumber.Substring(vacancyPrefix.Length)) + 1 : 0;

        // Combine prefix with the next sequential number (sequential number is padded to 4 digits, i.e 0001)
        return vacancyPrefix + nextSequenceNumber.ToString("D4");
    }
}
