using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.Costcentres;

public class GetCostcentres(ILogger<GetCostcentres> logger, ICostcentreRepository costcentreRepository)
{
    /// <summary>
    /// Gets all costcentres from the database
    /// </summary>
    /// <param name="req">Input GET request</param>
    /// <returns>
    /// All costcentres in the database
    /// </returns>
    [Function("GetCostcentres")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "costcentres")] HttpRequest req
    )
    {
        logger.LogInformation("Getting all costcentres");

        var costcentres = await costcentreRepository.GetAllCostcentres();
        return new OkObjectResult(costcentres);
    }
}
