using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.CRUDChangeLogs;

public class GetCRUDChangeLogsByObjectId(
    ILogger<GetCRUDChangeLogsByObjectId> logger,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    [Function("GetCRUDChangeLogsByObjectId")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "crudchangelogs/object/{objectid}")] HttpRequest req
    )
    {
        var sanitizedId = (req.RouteValues["objectid"] as string)
            ?.Replace(Environment.NewLine, "")
            .Replace("\n", "")
            .Replace("\r", "");
        logger.LogInformation("Getting CRUD change logs for object ID: {objectid}", sanitizedId);

        if (!Guid.TryParse(req.RouteValues["objectid"] as string, out var objectId))
        {
            return new BadRequestObjectResult($"Failed to parse {req.RouteValues["objectid"]} as a Guid");
        }

        var CRUDChangeLogs = await CRUDChangeLogRepository.GetCRUDChangeLogsByObjectId(objectId);

        if (CRUDChangeLogs.Count != 0)
            return new OkObjectResult(CRUDChangeLogs);

        logger.LogInformation("No CRUD change logs found for orbject ID: {objectid}", objectId);
        return new OkObjectResult(new List<object>());
    }
}
