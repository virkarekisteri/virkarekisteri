using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.ChangeLogs;

public class GetPositionChangeLog(
    ILogger<GetPositionChangeLog> logger,
    IChangeLogRepository changeLogRepository
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
            return new BadRequestObjectResult($"Failed to parse {req.RouteValues["positionId"]} as a Guid");

        var changeLogs = await changeLogRepository.GetChangeLogsByPositionId(positionId);

        if (changeLogs is null || !changeLogs.Any())
        {
            logger.LogInformation("No change logs found for position ID: {PositionId}", positionId);
            return new NotFoundObjectResult($"No change logs found for position ID {positionId}");
        }

        return new OkObjectResult(changeLogs);
    }
}
