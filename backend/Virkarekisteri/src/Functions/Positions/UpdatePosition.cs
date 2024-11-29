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
    IChangeLogRepository changeLogRepository,
    IOrganizationTreeRepository organizationTreeRepository
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
        
        var changeLogs = new List<ChangeLog>();
        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
        var decisionNumber = updateDto.DecisionNumber ?? "Unknown";

        void LogChange(string field, string? oldValue, string? newValue)
        {
            if (AreValuesEquivalent(oldValue, newValue)) 
                return;

            changeLogs.Add(new ChangeLog
            {
                PositionId = positionId,
                EditedField = field,
                OldValue = oldValue ?? string.Empty,
                NewValue = newValue ?? string.Empty,
                Editor = editor,
                Timestamp = DateTime.UtcNow,
                DecisionNumber = decisionNumber
            });
            
        }

        logger.LogInformation("2/3 : Updated Position Details: {@Position}", existingPosition);

        // Map only provided fields from UpdatePositionDto to the existing Position
        LogChange("EndedAt", existingPosition.EndedAt?.ToString(), updateDto.EndedAt?.ToString());
        existingPosition.EndedAt = updateDto.EndedAt ?? existingPosition.EndedAt;

        LogChange("EndingDecisionNumber", existingPosition.EndingDecisionNumber, updateDto.EndingDecisionNumber);
        existingPosition.EndingDecisionNumber = updateDto.EndingDecisionNumber ?? existingPosition.EndingDecisionNumber;

        LogChange("PlacementLocation", existingPosition.PlacementLocation, updateDto.PlacementLocation);
        existingPosition.PlacementLocation = updateDto.PlacementLocation ?? existingPosition.PlacementLocation;

        LogChange("VacancyFill", existingPosition.VacancyFill?.ToString(), updateDto.VacancyFill?.ToString());
        existingPosition.VacancyFill = updateDto.VacancyFill ?? existingPosition.VacancyFill;

        LogChange("VacancySize", existingPosition.VacancySize?.ToString(), updateDto.VacancySize?.ToString());
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

        if (updateDto.OrgTreeId != null && updateDto.OrgTreeId != existingPosition.OrgTreeId)
        {
            var oldOrganizationName = await organizationTreeRepository.GetOrganizationNameById(existingPosition.OrgTreeId);
            var newOrganizationName = await organizationTreeRepository.GetOrganizationNameById(updateDto.OrgTreeId.Value);

            LogChange("OrgTreeId", oldOrganizationName, newOrganizationName);

            existingPosition.OrgTreeId = updateDto.OrgTreeId.Value;
        }

        if (!string.IsNullOrEmpty(updateDto.PositionName))
        {
            var positionNameId = await positionNameRepository.GetPositionNameIdByName(updateDto.PositionName);
            if (positionNameId == null)
            {
                // Create a new PositionName if it doesn't exist
                positionNameId = await positionNameRepository.CreatePositionName(updateDto.PositionName);
            }
            var oldPositionName = await positionNameRepository.GetPositionNameById(existingPosition.PositionNameId);
            var newPositionName = await positionNameRepository.GetPositionNameById(positionNameId.Value);

            // Log the change
            LogChange("PositionName", oldPositionName, newPositionName);existingPosition.PositionNameId = positionNameId.Value;
            existingPosition.PositionNameId = positionNameId.Value;
        }

        await positionRepository.UpdatePosition(existingPosition);

        foreach (var changeLog in changeLogs)
        {
            await changeLogRepository.AddChangeLogEntry(changeLog);
        }

        logger.LogInformation("3/3 : Successfully updated position with ID: {Id}", id);
        return new NoContentResult();
    }

    private static bool AreValuesEquivalent(string? oldValue, string? newValue)
    {
        // Treat null and empty as equivalent
        if (string.IsNullOrWhiteSpace(oldValue) && string.IsNullOrWhiteSpace(newValue))
            return true;

        // Normalize numeric strings to a consistent format and compare
        if (decimal.TryParse(oldValue, out var oldDecimal) && decimal.TryParse(newValue, out var newDecimal))
        {
            return oldDecimal == newDecimal;
        }

        // Fallback to trimmed string comparison for non-numeric values
        return oldValue?.Trim() == newValue?.Trim();
    }
}
