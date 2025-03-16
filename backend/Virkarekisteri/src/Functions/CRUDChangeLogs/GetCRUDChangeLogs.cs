using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.CRUDChangeLogs;

public class GetAllCRUDChangeLogs(
    ILogger<GetAllCRUDChangeLogs> logger,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    [Function("GetAllCRUDChangeLogs")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "crudchangelogs")] HttpRequest req
    )
    {
        logger.LogInformation("Fetching all CRUD change logs");

        try
        {
            var CRUDChangeLogs = await CRUDChangeLogRepository.GetAllCRUDChangeLogs();

            if (CRUDChangeLogs.Count == 0)
            {
                logger.LogInformation("No CRUD change logs found");
                return new OkObjectResult(new List<object>());
            }

            return new OkObjectResult(CRUDChangeLogs);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while fetching CRUD change logs");
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}
