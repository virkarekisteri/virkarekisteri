using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.PositionChangeLogs;

public class GetPositionChangeLog(
    ILogger<GetPositionChangeLog> logger,
    IPositionChangeLogRepository positionChangeLogRepository
)
{
    [Function("GetPositionChangeLog")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "positions/{positionId}/changelog")] HttpRequest req
    )
    {
        var sanitizedId = (req.RouteValues["positionId"] as string)
            ?.Replace(Environment.NewLine, "")
            .Replace("\n", "")
            .Replace("\r", "");
        logger.LogInformation("Getting change logs for position ID: {PositionId}", sanitizedId);

        if (!Guid.TryParse(req.RouteValues["positionId"] as string, out var positionId))
        {
            return new BadRequestObjectResult($"Failed to parse {req.RouteValues["positionId"]} as a Guid");
        }

        var positionChangeLogs = await positionChangeLogRepository.GetPositionChangeLogsByPositionId(positionId);

        if (positionChangeLogs.Count != 0)
            return new OkObjectResult(positionChangeLogs);

        logger.LogInformation("No change logs found for position ID: {PositionId}", positionId);
        return new OkObjectResult(new List<object>());
    }
}
