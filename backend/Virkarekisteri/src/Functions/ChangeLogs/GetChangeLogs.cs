using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.ChangeLogs;

public class GetAllChangeLogs(ILogger<GetAllChangeLogs> logger, IChangeLogRepository changeLogRepository)
{
    [Function("GetAllChangeLogs")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "changelogs")] HttpRequest req
    )
    {
        logger.LogInformation("Fetching all change logs");

        try
        {
            var changeLogs = await changeLogRepository.GetAllChangeLogs();

            if (changeLogs.Count() == 0)
            {
                logger.LogInformation("No change logs found");
                return new OkObjectResult(new List<object>());
            }

            return new OkObjectResult(changeLogs);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while fetching change logs");
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}
