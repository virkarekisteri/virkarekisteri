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
    IPositionNameRepository positionNameRepository,
    IPositionChangeLogRepository positionChangeLogRepository,
    ICostcentreRepository costcentreRepository,
    ISubjectRepository subjectRepository
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

        if (updateDto.PricingId is { Length: > 20 })
            return new BadRequestObjectResult("PricingId cannot be more than 20 characters.");

        if (updateDto.VacancyFill is < 0 or > 1)
            return new BadRequestObjectResult("VacancyFill must be between 0% and 100%.");

        if (updateDto.VacancySize is < 0 or > 1)
            return new BadRequestObjectResult("VacancySize must be between 0% and 100%.");

        if (updateDto.VacancyFill > updateDto.VacancySize)
            return new BadRequestObjectResult("VacancyFill cannot be greater than VacancySize.");

        // Fetch the existing position from the database
        var existingPosition = await positionRepository.GetPosition(positionId);
        if (existingPosition == null)
            return new NotFoundResult();

        var positionChangeLogs = new List<PositionChangeLog>();
        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
        var decisionNumber = updateDto.DecisionNumber ?? "Unknown";

        logger.LogInformation("2/3 : Updated Position Details: {@Position}", existingPosition);

        // Map only provided fields from UpdatePositionDto to the existing Position
        PositionLogChange("EndedAt", existingPosition.EndedAt?.ToString(), updateDto.EndedAt?.ToString());
        existingPosition.EndedAt = updateDto.EndedAt ?? existingPosition.EndedAt;

        PositionLogChange(
            "EndingDecisionNumber",
            existingPosition.EndingDecisionNumber,
            updateDto.EndingDecisionNumber
        );
        existingPosition.EndingDecisionNumber = updateDto.EndingDecisionNumber ?? existingPosition.EndingDecisionNumber;

        PositionLogChange("PlacementLocation", existingPosition.PlacementLocation, updateDto.PlacementLocation);
        existingPosition.PlacementLocation = updateDto.PlacementLocation ?? existingPosition.PlacementLocation;

        PositionLogChange(
            "VacancyFill",
            existingPosition.VacancyFill?.ToString("0.##"),
            updateDto.VacancyFill?.ToString("0.##")
        );
        existingPosition.VacancyFill = updateDto.VacancyFill ?? existingPosition.VacancyFill;

        PositionLogChange(
            "VacancySize",
            existingPosition.VacancySize?.ToString("0.##"),
            updateDto.VacancySize?.ToString("0.##")
        );
        existingPosition.VacancySize = updateDto.VacancySize ?? existingPosition.VacancySize;

        PositionLogChange("PricingId", existingPosition.PricingId, updateDto.PricingId);
        existingPosition.PricingId = updateDto.PricingId ?? existingPosition.PricingId;

        PositionLogChange("EducationLevel", existingPosition.EducationLevel, updateDto.EducationLevel);
        existingPosition.EducationLevel = updateDto.EducationLevel ?? existingPosition.EducationLevel;

        PositionLogChange("WorkExperience", existingPosition.WorkExperience, updateDto.WorkExperience);
        existingPosition.WorkExperience = updateDto.WorkExperience ?? existingPosition.WorkExperience;

        PositionLogChange("Details", existingPosition.Details, updateDto.Details);
        existingPosition.Details = updateDto.Details ?? existingPosition.Details;

        PositionLogChange("Type", existingPosition.Type.ToString(), updateDto.Type?.ToString());
        existingPosition.Type = updateDto.Type ?? existingPosition.Type;

        PositionLogChange("IsTeacher", existingPosition.IsTeacher.ToString(), updateDto.IsTeacher?.ToString());
        existingPosition.IsTeacher = updateDto.IsTeacher ?? existingPosition.IsTeacher;

        // Logging of changes to the positions subjects.
        // Fetch the names of the subjects from the repository.
        var existingSubjects = (await subjectRepository.GetSubjectsByIds(existingPosition.SubjectIds))
            .Select(s => s.SubjectName)
            .ToList();

        var newSubjects = (await subjectRepository.GetSubjectsByIds(updateDto.SubjectIds))
            .Select(s => s.SubjectName)
            .ToList();

        // Log the names of the subjects instead of the IDs
        PositionLogChange(
            "PositionSubjects",
            existingSubjects.Any() ? string.Join(", ", existingSubjects) : string.Empty,
            newSubjects.Any() ? string.Join(", ", newSubjects) : string.Empty
        );
        existingPosition.SubjectIds = updateDto.SubjectIds ?? existingPosition.SubjectIds;

        if (updateDto.CostcentreId != null && updateDto.CostcentreId != existingPosition.CostcentreId)
        {
            var oldCostcentreName = await costcentreRepository.GetCostcentreNameById(existingPosition.CostcentreId);

            var newCostcentreName = await costcentreRepository.GetCostcentreNameById(updateDto.CostcentreId.Value);

            PositionLogChange("CostcentreId", oldCostcentreName, newCostcentreName);

            existingPosition.CostcentreId = updateDto.CostcentreId.Value;
        }

        if (updateDto.PositionName?.Name is not null)
        {
            var positionNameId = await positionNameRepository.GetPositionNameIdByName(updateDto.PositionName.Name);
            if (positionNameId == null)
            {
                // Provide default values for validFrom and validUntil if not available
                var name = updateDto.PositionName.Name;
                var validFrom = updateDto.PositionName.ValidFrom;
                var validUntil = updateDto.PositionName.ValidUntil;

                positionNameId = await positionNameRepository.CreatePositionName(name, validFrom, validUntil);
            }
            var oldPositionName = await positionNameRepository.GetPositionNameById(existingPosition.PositionNameId);
            var newPositionName = await positionNameRepository.GetPositionNameById(positionNameId.Value);

            PositionLogChange("PositionName", oldPositionName, newPositionName);
            existingPosition.PositionNameId = positionNameId.Value;
        }

        await positionRepository.UpdatePosition(existingPosition);

        foreach (var positionChangeLog in positionChangeLogs)
        {
            await positionChangeLogRepository.AddPositionChangeLogEntry(positionChangeLog);
        }

        logger.LogInformation("3/3 : Successfully updated position with ID: {Id}", id);
        return new NoContentResult();

        void PositionLogChange(string field, string? oldValue, string? newValue)
        {
            // No need to log changes if there are none and the values are the same
            if (AreValuesEquivalent(oldValue, newValue))
                return;

            positionChangeLogs.Add(
                new PositionChangeLog
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
