using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using Virkarekisteri.src.Models;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Costcentres;

// PUT /costcentres/{id}
public class UpdateCostcentre(
    ILogger<UpdateCostcentre> logger,
    ICostcentreRepository costcentreRepository,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    /// <summary>
    /// Updates a costcentre in the database
    /// </summary>
    /// <param name="req">Input PUT request with body containing Costcentre to update</param>
    /// <param name="id">The ID of the costcentre to update</param>
    /// <returns>
    /// No content on success or an error
    /// </returns>
    [Function("UpdateCostcentre")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "PUT", Route = "costcentres/{id}")] HttpRequest req,
        string id
    )
    {
        logger.LogInformation("1/3 : Updating costcentre with ID: {Id}", id);

        if (!Guid.TryParse(id, out var costcentreId))
            return new BadRequestObjectResult($"Invalid ID format: {id}");

        // Deserialize payload into UpdateCostcentreDto
        var (error, updateDto) = await TryDeserializeRequestBody<UpdateCostcentreDto>(req);

        if (error != null)
            return error;

        // Fetch the existing costcentre from the database
        var existingCostcentre = await costcentreRepository.GetCostcentreById(costcentreId);
        if (existingCostcentre == null)
            return new NotFoundResult();

        var CRUDChangeLogs = new List<CRUDChangeLog>();
        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";

        logger.LogInformation("2/3 : Updated Costcentre Details: {@Costcentre}", existingCostcentre);

        // Map only provided fields from UpdateCostcentreDto to the existing Costcentre
        CRUDLogChange("Number", existingCostcentre.Number.ToString(), updateDto.Number.ToString());
        existingCostcentre.Number = updateDto.Number ?? existingCostcentre.Number;

        CRUDLogChange("Name", existingCostcentre.Name, updateDto.Name);
        existingCostcentre.Name = updateDto.Name ?? existingCostcentre.Name;

        CRUDLogChange("ValidFrom", existingCostcentre.ValidFrom.ToString(), updateDto.ValidFrom.ToString());
        existingCostcentre.ValidFrom = updateDto.ValidFrom;

        CRUDLogChange("ValidUntil", existingCostcentre.ValidUntil.ToString(), updateDto.ValidUntil.ToString());
        existingCostcentre.ValidUntil = updateDto.ValidUntil;

        await costcentreRepository.UpdateCostcentre(existingCostcentre);

        foreach (var crudChangeLog in CRUDChangeLogs)
        {
            await CRUDChangeLogRepository.AddCRUDChangeLogEntry(crudChangeLog);
        }

        logger.LogInformation("3/3 : Costcentre updated successfully");
        return new NoContentResult();

        void CRUDLogChange(string field, string? oldValue, string? newValue)
        {
            // No need to log changes if there are none and the values are the same
            if (AreValuesEquivalent(oldValue, newValue))
                return;

            CRUDChangeLogs.Add(
                new CRUDChangeLog
                {
                    ObjectType = "Costcentre",
                    ObjectId = costcentreId,
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
