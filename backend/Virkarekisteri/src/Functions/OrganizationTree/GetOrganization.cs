using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

public class GetOrganization(ILogger<GetOrganization> logger, IOrganizationTreeRepository organizationTreeRepository)
{
    /// <summary>
    /// Gets a organization by id
    /// </summary>
    /// <param name="req">Input GET request containing the ID</param>
    /// <returns>
    /// The organization with the given ID
    /// </returns>
    [Function("GetOrganization")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "organizationtrees/{id}")] HttpRequest req
    )
    {
        var sanitizedId = (req.RouteValues["id"] as string)?.Replace(Environment.NewLine, "").Replace("\n", "").Replace("\r", "");
        logger.LogInformation("Getting organization by id: {Id}", sanitizedId);

        if (!Guid.TryParse(req.RouteValues["id"] as string, out var organizationTreeId))
            return new BadRequestObjectResult($"Failed to parse {req.RouteValues["id"]} as a Guid");

        var organization = await organizationTreeRepository.GetOrganizationTreeById(organizationTreeId);

        if (organization is null)
            return new NotFoundResult();

        return new OkObjectResult(organization);
    }
}
