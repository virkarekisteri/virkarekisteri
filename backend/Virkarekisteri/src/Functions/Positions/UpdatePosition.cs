using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Positions;

public class UpdatePosition(
    ILogger<UpdatePosition> logger,
    IPositionRepository positionRepository,
    IPositionNameRepository positionNameRepository
)
{
    /// <summary>
    /// /positions/{id} PUT endpoint to update an existing position in the database
    /// </summary>
    /// <param name="req">Input PUT request with fields to update in the body </param>
    /// <param name="id">The ID of the position to update</param>
    /// <returns>
    /// No content on success or an error
    /// </returns>
    [Function("UpdatePosition")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "PUT", Route = "positions/{id}")] HttpRequest req,
        string id
    )
    {
        logger.LogInformation("1/3 : Updating position with ID: {Id}", id);

        if (!Guid.TryParse(id, out var positionId))
            return new BadRequestObjectResult($"Invalid ID format: {id}");

        // Deserialize payload into UpdatePositionDto
        var (error, updateDto) = await TryDeserializeRequestBody<UpdatePositionDto>(req);
        if (error != null)
            return error;

        // Fetch the existing position from the database
        var existingPosition = await positionRepository.GetPosition(positionId);
        if (existingPosition == null)
            return new NotFoundResult();

        if (updateDto.PricingId != null && updateDto.PricingId.Length > 10)
            return new BadRequestObjectResult("PricingId cannot be more than 10 characters.");

        logger.LogInformation("2/3 : Updated Position Details: {@Position}", existingPosition);

        // Map only provided fields from UpdatePositionDto to the existing Position
        existingPosition.EndedAt = updateDto.EndedAt ?? existingPosition.EndedAt;
        existingPosition.EndingDecisionNumber = updateDto.EndingDecisionNumber ?? existingPosition.EndingDecisionNumber;
        existingPosition.PlacementLocation = updateDto.PlacementLocation ?? existingPosition.PlacementLocation;
        existingPosition.VacancyFill = updateDto.VacancyFill ?? existingPosition.VacancyFill;
        existingPosition.VacancySize = updateDto.VacancySize ?? existingPosition.VacancySize;
        existingPosition.PricingId = updateDto.PricingId ?? existingPosition.PricingId;
        existingPosition.EducationLevel = updateDto.EducationLevel ?? existingPosition.EducationLevel;
        existingPosition.WorkExperience = updateDto.WorkExperience ?? existingPosition.WorkExperience;
        existingPosition.Details = updateDto.Details ?? existingPosition.Details;
        existingPosition.Type = updateDto.Type ?? existingPosition.Type;
        existingPosition.OrgTreeId = updateDto.OrgTreeId ?? existingPosition.OrgTreeId;

        if (!string.IsNullOrEmpty(updateDto.PositionName))
        {
            var positionNameId = await positionNameRepository.GetPositionNameIdByName(updateDto.PositionName);
            if (positionNameId == null)
            {
                // Create a new PositionName if it doesn't exist
                positionNameId = await positionNameRepository.CreatePositionName(updateDto.PositionName);
            }
            existingPosition.PositionNameId = positionNameId.Value;
        }

        await positionRepository.UpdatePosition(existingPosition);

        logger.LogInformation("3/3 : Successfully updated position with ID: {Id}", id);
        return new NoContentResult();
    }
}
