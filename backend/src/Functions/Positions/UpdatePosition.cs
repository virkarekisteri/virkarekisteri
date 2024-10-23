using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Positions;

public class UpdatePosition(
    ILogger<CreatePosition> logger,
    PositionRepository positionRepository,
    PositionNameRepository positionNameRepository
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
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "PUT", Route = "positions/{id}")] HttpRequest req,
        string id
    )
    {
        logger.LogInformation("Updating position with ID: {Id}", id);

        // Validate ID
        if (!Guid.TryParse(id, out var positionId))
        {
            return new BadRequestObjectResult($"Invalid ID format: {id}");
        }

        // Deserialize req body into DTO
        var (error, updateDto) = await TryDeserializeRequestBody<UpdatePositionDto>(req);
        if (error is not null)
        {
            return error;
        }

        // Fetch the existing position
        var existingPosition = await positionRepository.GetPosition(positionId);
        if (existingPosition == null)
        {
            return new NotFoundResult(); // 404 if position not found
        }

        existingPosition.EndedAt = updateDto.EndedAt;
        existingPosition.EndingDecisionNumber = updateDto.EndingDecisionNumber;

        // Check if the request contains a new PositionName to update
        if (!string.IsNullOrEmpty(updateDto.PositionName))
        {
            // Check if the PositionName already exists in the PositionNames table
            var positionNameId = await positionNameRepository.GetPositionNameIdByName(updateDto.PositionName);

            if (positionNameId == null)
            {
                // If the PositionName doesn't exist, create a new one
                positionNameId = await positionNameRepository.CreatePositionName(updateDto.PositionName);
            }

            // Update the Position's PositionNameId with the new or existing PositionNameId
            existingPosition.PositionNameId = positionNameId.Value;
        }

        // Update the position in the database
        await positionRepository.UpdatePosition(existingPosition);

        logger.LogInformation("Successfully updated position with ID: {Id}", id);
        return new NoContentResult(); // 204 No Content on success
    }
}
