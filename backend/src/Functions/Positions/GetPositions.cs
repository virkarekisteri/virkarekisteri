using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.Positions;

public class GetPositions(ILogger<GetPosition> logger, PositionRepository positionRepository)
{
    /// <summary>
    /// Gets all positions from the database
    /// </summary>
    /// <param name="req">Input GET request</param>
    /// <returns>
    /// All positions in the database
    /// </returns>
    [Function("GetPositions")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "positions")] HttpRequest req
    )
    {
        logger.LogInformation("Getting all positions");

        var position = await positionRepository.GetPositions();
        return new OkObjectResult(position);
    }
}
