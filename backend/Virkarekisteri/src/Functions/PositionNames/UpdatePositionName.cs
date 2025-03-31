using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using Virkarekisteri.src.Models;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.PositionNames;

// PUT /positionnames/{id}
public class UpdatePositionName(
    ILogger<UpdatePositionName> logger,
    IPositionNameRepository positionNameRepository,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    /// <summary>
    /// Updates a position name in the database
    /// </summary>
    /// <param name="req">Input PUT request with body containing PositionName to update</param>
    /// <param name="id">The ID of the position name to update</param>
    /// <returns>
    /// No content on success or an error
    /// </returns>
    [Function("UpdatePositionName")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "PUT", Route = "positionnames/{id}")] HttpRequest req,
        string id
    )
    {
        logger.LogInformation("1/3 : Updating position name with ID: {Id}", id);

        if (!Guid.TryParse(id, out var positionNameId))
            return new BadRequestObjectResult($"Invalid ID format: {id}");

        // Deserialize payload into UpdatePositionNameDto
        var (error, updateDto) = await TryDeserializeRequestBody<UpdatePositionNameDto>(req);

        if (error != null)
            return error;

        // Fetch the existing position name from the database
        var existingPositionName = await positionNameRepository.GetPositionNameById(positionNameId);
        if (existingPositionName == null)
            return new NotFoundResult();

        logger.LogInformation("2/3 : Updated PositionName Details: {@PositionName}", existingPositionName);

        // Apply updates from updateDto
        existingPositionName.Name = updateDto.Name;
        existingPositionName.ValidFrom = updateDto.ValidFrom;
        existingPositionName.ValidUntil = updateDto.ValidUntil;

        // Update the position name in the database
        try
        {
            await positionNameRepository.UpdatePositionName(existingPositionName);
            logger.LogInformation("3/3 : PositionName updated successfully");
            return new NoContentResult();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while updating the position name.");
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}
