using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Positions;

public class CreatePosition(
    ILogger<CreatePosition> logger,
    PositionRepository positionRepository,
    PositionNameRepository positionNameRepository
)
{
    /// <summary>
    /// /postitions POST endpoint to add a new position to the database
    /// Runs a database stored procedure to add the new position
    /// </summary>
    /// <param name="req">Input POST request with body containing Position to create</param>
    /// <returns>
    /// The created position
    /// </returns>
    [Function("CreatePosition")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = "positions")] HttpRequest req
    )
    {
        logger.LogInformation("Creating a new position from JSON POST request body");

        var (error, requestPosition) = await TryDeserializeRequestBody<Position>(req);

        if (error is not null)
            return error;

        // Check if positionName is provided and exists in PositionNames table
        if (!string.IsNullOrEmpty(requestPosition.PositionName?.Name))
        {
            var positionNameId = await positionNameRepository.GetPositionNameIdByName(
                requestPosition.PositionName.Name
            );

            if (positionNameId == null)
            {
                positionNameId = await positionNameRepository.CreatePositionName(requestPosition.PositionName.Name);
            }

            requestPosition.PositionNameId = (Guid)positionNameId;
        }

        var createdPosition = await positionRepository.CreatePosition(requestPosition);
        return new OkObjectResult(createdPosition);
    }
}
