using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using Virkarekisteri.src.Models;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Subjects;

public class UpdateSubject(
    ILogger<UpdateSubject> logger,
    ISubjectRepository subjectRepository,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    /// <summary>
    /// /subjects/{id} PUT endpoint to update a subject in the database
    /// </summary>
    /// <param name="req">Input PUT request with body containing Subject to update</param>
    /// <param name="id">The ID of the subject to update</param>
    /// <returns>
    /// No content on success or an error
    /// </returns>
    [Function("UpdateSubject")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "PUT", Route = "subjects/{id}")] HttpRequest req,
        string id
    )
    {
        logger.LogInformation("1/3 : Updating subject with ID: {Id}", id);

        if (!Guid.TryParse(id, out var subjectId))
            return new BadRequestObjectResult($"Invalid ID format: {id}");

        // Deserialize payload into UpdateSubjectDto
        var (error, updateDto) = await TryDeserializeRequestBody<UpdateSubjectDto>(req);

        if (error != null)
            return error;

        // Fetch the existing subject from the database
        var existingSubject = await subjectRepository.GetSubject(subjectId);
        if (existingSubject == null)
            return new NotFoundResult();

        var CRUDChangeLogs = new List<CRUDChangeLog>();
        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";

        logger.LogInformation("2/3 : Updated Subject Details: {@Subject}", existingSubject);

        // Map only provided fields from UpdateSubjectDto to the existing Subject
        CRUDLogChange("SubjectName", existingSubject.SubjectName, updateDto.SubjectName);
        existingSubject.SubjectName = updateDto.SubjectName ?? existingSubject.SubjectName;

        CRUDLogChange("Active", existingSubject.Active.ToString(), updateDto.Active?.ToString());
        existingSubject.Active = updateDto.Active ?? existingSubject.Active;

        await subjectRepository.UpdateSubject(existingSubject);

        foreach (var crudChangeLog in CRUDChangeLogs)
        {
            await CRUDChangeLogRepository.AddCRUDChangeLogEntry(crudChangeLog);
        }

        logger.LogInformation("3/3 : Successfully updated position with ID: {Id}", id);
        return new NoContentResult();

        void CRUDLogChange(string field, string? oldValue, string? newValue)
        {
            // No need to log changes if there are none and the values are the same
            if (AreValuesEquivalent(oldValue, newValue))
                return;

            CRUDChangeLogs.Add(
                new CRUDChangeLog
                {
                    ObjectType = "Subject",
                    ObjectId = subjectId,
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
