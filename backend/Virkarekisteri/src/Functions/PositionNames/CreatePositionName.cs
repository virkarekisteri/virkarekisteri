using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.src.Functions.PositionNames;

public class CreatePositionName(
    ILogger<CreatePositionName> logger,
    IPositionNameRepository positionNameRepository,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    /// <summary>
    /// Creates a position name in the database
    /// </summary>
    /// <param name="req">Input POST request with body containing PositionName to create</param>
    /// <returns>
    /// The created position name
    /// </returns>
    [Function("CreatePositionName")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = "positionnames")] HttpRequest req
    )
    {
        logger.LogInformation("Creating a new position name from JSON POST request body");

        var (error, requestPositionName) = await TryDeserializeRequestBody<PositionName>(req);

        if (error is not null)
            return error;

        if (string.IsNullOrWhiteSpace(requestPositionName.Name))
        {
            return new BadRequestObjectResult("PositionName's name must be provided.");
        }

        // Call repository to check if position name exists before adding
        var (exists, existingPositionName) = await positionNameRepository.CreatePositionName(requestPositionName);

        if (exists)
        {
            return new ConflictObjectResult(
                new
                {
                    message = "A position name with this name already exists.",
                    existingObject = existingPositionName,
                }
            );
        }

        return new OkObjectResult(requestPositionName);
    }
}
