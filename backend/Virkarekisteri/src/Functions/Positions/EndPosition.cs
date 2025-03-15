using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Positions;

public class EndPosition(
    ILogger<EndPosition> logger,
    IPositionRepository positionRepository,
    IPositionChangeLogRepository positionChangeLogRepository
)
{
    /// <summary>
    /// /positions/{id}/end POST endpoint to end a position
    /// </summary>
    /// <param name="req">Input PUT request with fields to update in the body </param>
    /// <param name="id">The ID of the position to end</param>
    /// <returns>
    /// No content on success or an error
    /// </returns>
    [Function("EndPosition")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "PATCH", Route = "positions/{id}/end")] HttpRequest req,
        string id
    )
    {
        logger.LogInformation("Ending position with ID: {Id}", id);

        if (!Guid.TryParse(id, out var positionId))
            return new BadRequestObjectResult($"Invalid ID format: {id}");

        var (error, endDto) = await TryDeserializeRequestBody<EndPositionDto>(req);

        if (error != null)
            return error;

        var position = await positionRepository.GetPosition(positionId);

        if (position == null)
            return new NotFoundResult();

        position.EndingDecisionNumber = endDto.EndingDecisionNumber;

        if (endDto.EndAt.Date <= DateTime.Now.Date)
        {
            position.VacancyStatus = 0;

            await positionChangeLogRepository.AddPositionChangeLogEntry(
                new PositionChangeLog
                {
                    PositionId = positionId,
                    EditedField = "VacancyStatus",
                    OldValue = "",
                    NewValue = "Lakkautettu",
                    Editor = req.HttpContext.Items["Editor"] as string ?? "Unknown",
                    Timestamp = DateTime.Now,
                    DecisionNumber = endDto.EndingDecisionNumber,
                }
            );
        }

        position.EndedAt = endDto.EndAt;

        await positionRepository.UpdatePosition(position);

        return new NoContentResult();
    }
}
