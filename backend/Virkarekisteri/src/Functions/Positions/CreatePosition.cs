using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Positions;

public class CreatePosition(
    ILogger<CreatePosition> logger,
    IPositionRepository positionRepository,
    IPositionNameRepository positionNameRepository,
    IPositionChangeLogRepository positionChangeLogRepository
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
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = "positions")] HttpRequest req
    )
    {
        logger.LogInformation("Creating a new position from JSON POST request body");

        var (error, requestPosition) = await TryDeserializeRequestBody<Position>(req);

        if (error is not null)
            return error;

        if (requestPosition.CostcentreId == Guid.Empty)
        {
            return new BadRequestObjectResult("CostcentreId must be provided.");
        }

        // Check that the costcentre's number is no more than 4 characters long.
        // This is because when creating the position, the costcentre number is used as a prefix for the position's vacancy number.
        // Longer costcentre number will result in a longer vacancy number, whose maximun length is 8 characters.
        var costcentreNumber = await positionRepository.GetCostcentreNumberById(requestPosition.CostcentreId);
        if (costcentreNumber.Length > 4)
        {
            return new BadRequestObjectResult("Costcentre number cannot be more than 4 characters long.");
        }

        if (requestPosition.PositionNameId == Guid.Empty)
        {
            return new BadRequestObjectResult("PositionNameId must be provided.");
        }

        var createdPosition = await positionRepository.CreatePosition(requestPosition);

        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
        var positionChangeLog = new PositionChangeLog
        {
            Id = Guid.NewGuid(),
            PositionId = createdPosition.Id,
            EditedField = "CreatedPosition",
            OldValue = string.Empty,
            NewValue = createdPosition.VacancyNumber ?? string.Empty,
            Editor = editor,
            Timestamp = DateTime.Now,
            DecisionNumber = createdPosition.CreationDecisionNumber,
        };
        await positionChangeLogRepository.AddPositionChangeLogEntry(positionChangeLog);

        return new OkObjectResult(createdPosition);
    }
}
