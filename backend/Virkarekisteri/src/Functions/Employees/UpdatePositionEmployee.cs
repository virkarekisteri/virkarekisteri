using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Employees;

public class UpdatePositionEmployee(
    ILogger<UpdatePositionEmployee> logger,
    IPositionEmployeeRepository positionEmployeeRepository,
    IPositionChangeLogRepository positionChangeLogRepository,
    IPositionRepository positionRepository
)
{
    /// <summary>
    /// Updates a position employee by id
    /// </summary>
    /// <param name="req">Input PUT request containing the ID and updated data</param>
    /// <returns>
    /// The updated position employee
    /// </returns>
    [Function("UpdatePositionEmployee")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "PUT", Route = "positionemployees/{id}")] HttpRequest req
    )
    {
        var sanitizedId = (req.RouteValues["id"] as string)
            ?.Replace(Environment.NewLine, "")
            .Replace("\n", "")
            .Replace("\r", "");
        logger.LogInformation("Getting position employee by id: {Id}", sanitizedId);

        if (!Guid.TryParse(req.RouteValues["id"] as string, out var positionEmployeeId))
            return new BadRequestObjectResult($"Failed to parse {req.RouteValues["id"]} as a Guid");

        var (error, updateDto) = await TryDeserializeRequestBody<UpdatePositionEmployeeDto>(req);

        if (error is not null)
            return error;

        var existingPositionEmployee = await positionEmployeeRepository.GetPositionEmployee(positionEmployeeId);

        if (existingPositionEmployee == null)
            return new NotFoundResult();

        var positionChangeLogs = new List<PositionChangeLog>();
        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
        var decisionNumber = updateDto.DecisionNumber ?? "Unknown";

        void PositionLogChange(string field, string? oldValue, string? newValue)
        {
            if (oldValue != newValue)
            {
                positionChangeLogs.Add(
                    new PositionChangeLog
                    {
                        PositionId = existingPositionEmployee.PositionId,
                        EditedField = field,
                        OldValue = oldValue ?? string.Empty,
                        NewValue = newValue ?? string.Empty,
                        Editor = editor,
                        DecisionNumber = decisionNumber,
                    }
                );
            }
        }

        PositionLogChange(
            "StartDate",
            existingPositionEmployee.StartDate.ToString("yyyy-MM-dd"),
            updateDto.StartDate?.ToString("yyyy-MM-dd")
        );
        PositionLogChange(
            "EndingDate",
            existingPositionEmployee.EndingDate?.ToString("yyyy-MM-dd"),
            updateDto.EndingDate?.ToString("yyyy-MM-dd")
        );
        PositionLogChange(
            "PositionId",
            existingPositionEmployee.PositionId.ToString(),
            updateDto.PositionId?.ToString()
        );
        PositionLogChange("EmployeeName", existingPositionEmployee.EmployeeName, updateDto.EmployeeName);

        if (updateDto.InLeave.HasValue && !updateDto.InLeave.Value && existingPositionEmployee.InLeave)
        {
            if (updateDto.PositionId.HasValue)
            {
                var position = await positionRepository.GetPosition(updateDto.PositionId.Value);
                if (position == null)
                    return new BadRequestObjectResult("Position not found");

                if (position.ReplacementEmployeeId.HasValue)
                {
                    var currentSubstituteName = string.Empty;

                    var currentSubstitute = await positionEmployeeRepository.GetPositionEmployee(
                        position.ReplacementEmployeeId.Value
                    );

                    if (currentSubstitute != null)
                        currentSubstituteName = currentSubstitute.EmployeeName;

                    position.ReplacementEmployeeId = null;

                    // Substitute is removed
                    PositionLogChange("Substitute", currentSubstituteName, existingPositionEmployee.EmployeeName);
                    await positionRepository.UpdatePosition(position);
                }
            }
            else
                return new BadRequestObjectResult("PositionId must be provided when an employee is no longer in leave");
        }

        // Update the existing position employee with the new values
        existingPositionEmployee.StartDate = updateDto.StartDate ?? existingPositionEmployee.StartDate;
        existingPositionEmployee.EndingDate = updateDto.EndingDate ?? existingPositionEmployee.EndingDate;
        existingPositionEmployee.PositionId = updateDto.PositionId ?? existingPositionEmployee.PositionId;
        existingPositionEmployee.EmployeeName = updateDto.EmployeeName ?? existingPositionEmployee.EmployeeName;
        existingPositionEmployee.Replacement = updateDto.Replacement ?? existingPositionEmployee.Replacement;
        existingPositionEmployee.InLeave = updateDto.InLeave ?? existingPositionEmployee.InLeave;

        await positionEmployeeRepository.UpdatePositionEmployee(existingPositionEmployee);

        foreach (var positionChangeLog in positionChangeLogs)
        {
            await positionChangeLogRepository.AddPositionChangeLogEntry(positionChangeLog);
        }

        return new OkObjectResult(existingPositionEmployee);
    }
}
