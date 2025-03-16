using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.CRUDChangeLogs;

public class GetCRUDChangeLogByObjectType(
    ILogger<GetCRUDChangeLogByObjectType> logger,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    [Function("GetCRUDChangeLogByObjectType")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "crudchangelogs/{objecttype}")] HttpRequest req
    )
    {
        var sanitizedType = (req.RouteValues["objecttype"] as string)
            ?.Replace(Environment.NewLine, "")
            .Replace("\n", "")
            .Replace("\r", "");
        logger.LogInformation("Getting CRUD change logs for object type: {objecttype}", sanitizedType);

        var CRUDChangeLog = await CRUDChangeLogRepository.GetCRUDChangeLogByObjectType(sanitizedType);

        if (CRUDChangeLog != null)
            return new OkObjectResult(CRUDChangeLog);

        logger.LogInformation("No CRUD change logs found for object type: {objecttype}", sanitizedType);
        return new OkObjectResult(new List<object>());
    }
}
