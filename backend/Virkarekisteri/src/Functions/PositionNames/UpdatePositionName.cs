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

        var CRUDChangeLogs = new List<CRUDChangeLog>();
        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";

        logger.LogInformation("2/3 : Updated PositionName Details: {@PositionName}", existingPositionName);

        // Map only provided fields from UpdatePositionNameDto to the existing PositionName
        CRUDLogChange("Name", existingPositionName.Name, updateDto.Name);
        existingPositionName.Name = updateDto.Name ?? existingPositionName.Name;

        CRUDLogChange("ValidFrom", existingPositionName.ValidFrom?.ToString(), updateDto.ValidFrom?.ToString());
        existingPositionName.ValidFrom = updateDto.ValidFrom ?? existingPositionName.ValidFrom;

        CRUDLogChange("ValidUntil", existingPositionName.ValidUntil?.ToString(), updateDto.ValidUntil?.ToString());
        existingPositionName.ValidUntil = updateDto.ValidUntil ?? existingPositionName.ValidUntil;

        // Apply updates from updateDto
        existingPositionName.Name = updateDto.Name;
        existingPositionName.ValidFrom = updateDto.ValidFrom;
        existingPositionName.ValidUntil = updateDto.ValidUntil;

        // Update the position name in the database
        try
        {
            await positionNameRepository.UpdatePositionName(existingPositionName);

            foreach (var crudChangeLog in CRUDChangeLogs)
            {
                await CRUDChangeLogRepository.AddCRUDChangeLogEntry(crudChangeLog);
            }

            logger.LogInformation("3/3 : PositionName updated successfully");
            return new NoContentResult();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while updating the position name.");
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }

        void CRUDLogChange(string field, string? oldValue, string? newValue)
        {
            if (AreValuesEquivalent(oldValue, newValue))
                return;

            CRUDChangeLogs.Add(
                new CRUDChangeLog
                {
                    ObjectType = "PositionName",
                    ObjectId = positionNameId,
                    EditedField = field,
                    OldValue = oldValue ?? string.Empty,
                    NewValue = newValue ?? string.Empty,
                    Editor = editor,
                    Timestamp = DateTime.Now,
                }
            );
        }
    }

    private static bool AreValuesEquivalent(string? oldValue, string? newValue)
    {
        // Normalize null/empty values
        oldValue = string.IsNullOrWhiteSpace(oldValue) ? null : oldValue.Trim();
        newValue = string.IsNullOrWhiteSpace(newValue) ? null : newValue.Trim();

        // Skip if both are null/empty
        if (oldValue == null && newValue == null)
            return true;

        // Skip if both values are identical
        if (oldValue == newValue)
            return true;

        // Treat "0,00" or "0" as equivalent to null/empty
        var isZeroOrEmpty = (string? value) => value == null || value == "0,00" || value == "0";

        if (isZeroOrEmpty(oldValue) && isZeroOrEmpty(newValue))
            return true;

        return false;
    }
}
