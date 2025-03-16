using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.CRUDChangeLogs;

public class GetCRUDChangeLogByObjectId(
    ILogger<GetCRUDChangeLogByObjectId> logger,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    [Function("GetCRUDChangeLogByObjectId")]
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

        var CRUDChangeLog = await CRUDChangeLogRepository.GetCRUDChangeLogByObjectId(objectId);

        if (CRUDChangeLog != null)
            return new OkObjectResult(CRUDChangeLog);

        logger.LogInformation("No CRUD change logs found for orbject ID: {objectid}", objectId);
        return new OkObjectResult(new List<object>());
    }
}
