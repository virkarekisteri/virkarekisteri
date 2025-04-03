using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.CRUDChangeLogs;

public class GetCRUDChangeLogsByObjectType(
    ILogger<GetCRUDChangeLogsByObjectType> logger,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    [Function("GetCRUDChangeLogsByObjectType")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "crudchangelogs/objecttype/{objecttype}")]
            HttpRequest req
    )
    {
        var sanitizedType = (req.RouteValues["objecttype"] as string)
            ?.Replace(Environment.NewLine, "")
            .Replace("\n", "")
            .Replace("\r", "");
        logger.LogInformation("Getting CRUD change logs for object type: {objecttype}", sanitizedType);

        var CRUDChangeLogs = await CRUDChangeLogRepository.GetCRUDChangeLogsByObjectType(sanitizedType);

        if (CRUDChangeLogs.Count != 0)
            return new OkObjectResult(CRUDChangeLogs);

        logger.LogInformation("No CRUD change logs found for object type: {objecttype}", sanitizedType);
        return new OkObjectResult(new List<object>());
    }
}
