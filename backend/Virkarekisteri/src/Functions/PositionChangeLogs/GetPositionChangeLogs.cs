using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.PositionChangeLogs;

public class GetAllPositionChangeLogs(
    ILogger<GetAllPositionChangeLogs> logger,
    IPositionChangeLogRepository positionChangeLogRepository
)
{
    [Function("GetAllPositionChangeLogs")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "positionchangelogs")] HttpRequest req
    )
    {
        logger.LogInformation("Fetching all position change logs");

        try
        {
            var positionChangeLogs = await positionChangeLogRepository.GetAllPositionChangeLogs();

            if (positionChangeLogs.Count == 0)
            {
                logger.LogInformation("No position change logs found");
                return new OkObjectResult(new List<object>());
            }

            return new OkObjectResult(positionChangeLogs);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while fetching position change logs");
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}
