using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface IOrganizationTreeRepository
{
    Task<List<OrganizationTree>> GetAllOrganizationTrees();
    Task<string?> GetOrganizationNameById(Guid id);
}

public class OrganizationTreeRepository(VirkarekisteriDb db) : IOrganizationTreeRepository
{
    public async Task<List<OrganizationTree>> GetAllOrganizationTrees()
    {
        return await db.OrganizationTrees.ToListAsync();
    }

    public async Task<string?> GetOrganizationNameById(Guid id)
    {
        var organizationTree = await db.OrganizationTrees.FirstOrDefaultAsync(ot => ot.Id == id);
        return organizationTree?.Name;
    }
}
