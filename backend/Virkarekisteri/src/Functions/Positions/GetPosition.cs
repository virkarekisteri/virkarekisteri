using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.Positions;

public class GetPosition(ILogger<GetPosition> logger, IPositionRepository positionRepository)
{
    /// <summary>
    /// Gets a position by id
    /// </summary>
    /// <param name="req">Input GET request containing the ID</param>
    /// <returns>
    /// The position with the given ID
    /// </returns>
    [Function("GetPosition")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "positions/{id}")] HttpRequest req
    )
    {
        logger.LogInformation("Getting position by id: {Id}", req.RouteValues["id"]);

        if (!Guid.TryParse(req.RouteValues["id"] as string, out var positionId))
            return new BadRequestObjectResult($"Failed to parse {req.RouteValues["id"]} as a Guid");

        var position = await positionRepository.GetPosition(positionId);

        if (position is null)
            return new NotFoundResult();

        return new OkObjectResult(position);
    }
}
