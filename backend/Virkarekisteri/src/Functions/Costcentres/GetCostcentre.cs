using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.Costcentres;

public class GetCostcentre(ILogger<GetCostcentre> logger, ICostcentreRepository costcentreRepository)
{
    /// <summary>
    /// Gets a costcentre by id from the database
    /// </summary>
    /// <param name="req">Input GET request</param>
    /// <param name="id">Id of the costcentre to get</param>
    /// <returns>
    /// The costcentre with the given id
    /// </returns>
    [Function("GetCostcentre")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "costcentres/{id}")] HttpRequest req,
        string id
    )
    {
        var sanitizedId = id.Replace("\n", "").Replace("\r", "");
        logger.LogInformation($"Getting costcentre with id {sanitizedId}");

        if (!Guid.TryParse(sanitizedId, out var costcentreId))
            return new BadRequestObjectResult($"Failed to parse {sanitizedId} as a Guid");

        var costcentre = await costcentreRepository.GetCostcentreById(costcentreId);

        if (costcentre == null)
            return new NotFoundResult();

        return new OkObjectResult(costcentre);
    }
}
