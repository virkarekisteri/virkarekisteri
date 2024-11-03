using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.OrganizationTree;

public class GetOrganizationTrees(
    ILogger<GetOrganizationTrees> logger,
    IOrganizationTreeRepository organizationTreeRepository
)
{
    /// <summary>
    /// Gets all organization trees from the database
    /// </summary>
    /// <param name="req">Input GET request</param>
    /// <returns>
    /// All organization trees in the database
    /// </returns>
    [Function("GetOrganizationTrees")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "organizationtrees")] HttpRequest req
    )
    {
        logger.LogInformation("Getting all organization trees");

        var organizationTrees = await organizationTreeRepository.GetAllOrganizationTrees();
        return new OkObjectResult(organizationTrees);
    }
}
