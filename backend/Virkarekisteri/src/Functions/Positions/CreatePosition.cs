using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Positions;

public class CreatePosition(
    ILogger<CreatePosition> logger,
    IPositionRepository positionRepository,
    IPositionNameRepository positionNameRepository,
    IChangeLogRepository changeLogRepository
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

        if (requestPosition.OrgTreeId == Guid.Empty)
        {
            return new BadRequestObjectResult("OrgTreeId must be provided.");
        }

        if (requestPosition.PositionNameId == Guid.Empty)
        {
            if (string.IsNullOrWhiteSpace(requestPosition.PositionName?.Name))
            {
                return new BadRequestObjectResult("Either PositionNameId or a valid PositionName must be provided.");
            }

            var positionNameId =
                await positionNameRepository.GetPositionNameIdByName(requestPosition.PositionName.Name)
                ?? await positionNameRepository.CreatePositionName(requestPosition.PositionName.Name);

            requestPosition.PositionNameId = positionNameId;
        }

        requestPosition.PositionName = null; // Nullify to avoid conflicts

        var createdPosition = await positionRepository.CreatePosition(requestPosition);

        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
        var changeLog = new ChangeLog
        {
            Id = Guid.NewGuid(),
            PositionId = createdPosition.Id,
            EditedField = "CreatedPosition",
            OldValue = string.Empty,
            NewValue = createdPosition.VacancyNumber ?? string.Empty,
            Editor = editor,
            Timestamp = DateTime.UtcNow,
            DecisionNumber = createdPosition.CreationDecisionNumber ?? string.Empty
        };
        await changeLogRepository.AddChangeLogEntry(changeLog);


        return new OkObjectResult(createdPosition);
    }
}
