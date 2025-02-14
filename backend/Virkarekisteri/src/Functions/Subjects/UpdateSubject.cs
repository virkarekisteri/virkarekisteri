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
    IChangeLogRepository changeLogRepository
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
        [HttpTrigger(AuthorizationLevel.Function, "PUT", Route = "subjects/{id}")] HttpRequest req, string id
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

        // TODO: ChangeLogit aineen muokkauksesta
        /*
        var changeLogs = new List<ChangeLog>();
        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
        var decisionNumber = updateDto.DecisionNumber ?? "Unknown";

        logger.LogInformation("2/3 : Updated Position Details: {@Position}", existingPosition);

        // Map only provided fields from UpdatePositionDto to the existing Position
        LogChange("EndedAt", existingPosition.EndedAt?.ToString(), updateDto.EndedAt?.ToString());
        existingPosition.EndedAt = updateDto.EndedAt ?? existingPosition.EndedAt;

        LogChange("EndingDecisionNumber", existingPosition.EndingDecisionNumber, updateDto.EndingDecisionNumber);
        existingPosition.EndingDecisionNumber = updateDto.EndingDecisionNumber ?? existingPosition.EndingDecisionNumber;

        LogChange("PlacementLocation", existingPosition.PlacementLocation, updateDto.PlacementLocation);
        existingPosition.PlacementLocation = updateDto.PlacementLocation ?? existingPosition.PlacementLocation;

        LogChange(
            "VacancyFill",
            existingPosition.VacancyFill?.ToString("0.##"),
            updateDto.VacancyFill?.ToString("0.##")
        );
        existingPosition.VacancyFill = updateDto.VacancyFill ?? existingPosition.VacancyFill;

        LogChange(
            "VacancySize",
            existingPosition.VacancySize?.ToString("0.##"),
            updateDto.VacancySize?.ToString("0.##")
        );
        existingPosition.VacancySize = updateDto.VacancySize ?? existingPosition.VacancySize;

        LogChange("PricingId", existingPosition.PricingId, updateDto.PricingId);
        existingPosition.PricingId = updateDto.PricingId ?? existingPosition.PricingId;

        LogChange("EducationLevel", existingPosition.EducationLevel, updateDto.EducationLevel);
        existingPosition.EducationLevel = updateDto.EducationLevel ?? existingPosition.EducationLevel;

        LogChange("WorkExperience", existingPosition.WorkExperience, updateDto.WorkExperience);
        existingPosition.WorkExperience = updateDto.WorkExperience ?? existingPosition.WorkExperience;

        LogChange("Details", existingPosition.Details, updateDto.Details);
        existingPosition.Details = updateDto.Details ?? existingPosition.Details;

        LogChange("Type", existingPosition.Type.ToString(), updateDto.Type?.ToString());
        existingPosition.Type = updateDto.Type ?? existingPosition.Type;
        */

        await subjectRepository.UpdateSubject(existingSubject);   
        return new NoContentResult(); // TODO: kommentoi pois kun logitus on valmis

        // TODO: More logging...
        /*
        foreach (var changeLog in changeLogs)
        {
            await changeLogRepository.AddChangeLogEntry(changeLog);
        }

        logger.LogInformation("3/3 : Successfully updated position with ID: {Id}", id);
        return new NoContentResult();

        void LogChange(string field, string? oldValue, string? newValue)
        {
            // No need to log changes if there are none and the values are the same
            if (AreValuesEquivalent(oldValue, newValue))
                return;

            changeLogs.Add(
                new ChangeLog
                {
                    PositionId = positionId,
                    EditedField = field,
                    OldValue = oldValue ?? string.Empty,
                    NewValue = newValue ?? string.Empty,
                    Editor = editor,
                    Timestamp = DateTime.Now,
                    DecisionNumber = decisionNumber,
                }
            );
        }
        */
    }
}