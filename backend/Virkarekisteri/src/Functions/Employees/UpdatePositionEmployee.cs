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
    IChangeLogRepository changeLogRepository
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

        var (error, requestPosition) = await TryDeserializeRequestBody<PositionEmployee>(req);

        if (error is not null)
            return error;

        if (requestPosition == null)
            return new BadRequestObjectResult("Invalid request body");

        var existingPositionEmployee = await positionEmployeeRepository.GetPositionEmployee(positionEmployeeId);

        if (existingPositionEmployee == null)
            return new NotFoundResult();
        
        var changeLogs = new List<ChangeLog>();
        var editor = req.HttpContext.Items["Editor"] as string; // Get the editor from middleware

        void LogChange(string field, string? oldValue, string? newValue)
        {
            if (oldValue != newValue)
            {
                changeLogs.Add(new ChangeLog
                {
                    PositionId = existingPositionEmployee.PositionId,
                    EditedField = field,
                    OldValue = oldValue ?? string.Empty,
                    NewValue = newValue ?? string.Empty,
                    Editor = editor ?? "Unknown"
                });
            }
        }

        LogChange("StartDate", existingPositionEmployee.StartDate.ToString("yyyy-MM-dd"), requestPosition.StartDate.ToString("yyyy-MM-dd"));
        LogChange("EndingDate", existingPositionEmployee.EndingDate?.ToString("yyyy-MM-dd"), requestPosition.EndingDate?.ToString("yyyy-MM-dd"));
        LogChange("PositionId", existingPositionEmployee.PositionId.ToString(), requestPosition.PositionId.ToString());
        LogChange("EmployeeName", existingPositionEmployee.EmployeeName, requestPosition.EmployeeName);

        // Update the existing position employee with the new values
        existingPositionEmployee.StartDate = requestPosition.StartDate;
        existingPositionEmployee.EndingDate = requestPosition.EndingDate;
        existingPositionEmployee.PositionId = requestPosition.PositionId;
        existingPositionEmployee.EmployeeName = requestPosition.EmployeeName;

        await positionEmployeeRepository.UpdatePositionEmployee(existingPositionEmployee);

        foreach (var changeLog in changeLogs)
        {
            await changeLogRepository.AddChangeLogEntry(changeLog);
        }

        return new OkObjectResult(existingPositionEmployee);
    }
}
