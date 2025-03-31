using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.PositionNames;

public class GetPositionName(ILogger<GetPositionName> logger, IPositionNameRepository positionNameRepository)
{
    /// <summary>
    /// Gets a position name by id from the database
    /// </summary>
    /// <param name="req">Input GET request</param>
    /// <param name="id">Id of the position name to get</param>
    /// <returns>
    /// The position name with the given id
    /// </returns>
    [Function("GetPositionName")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "positionnames/{id}")] HttpRequest req,
        string id
    )
    {
        var sanitizedId = id.Replace("\n", "").Replace("\r", "");
        logger.LogInformation($"Getting position name with id {sanitizedId}");

        if (!Guid.TryParse(sanitizedId, out var positionNameId))
            return new BadRequestObjectResult($"Failed to parse {sanitizedId} as a Guid");

        var positionName = await positionNameRepository.GetPositionNameNameById(positionNameId);

        if (positionName == null)
            return new NotFoundResult();

        return new OkObjectResult(positionName);
    }
}
