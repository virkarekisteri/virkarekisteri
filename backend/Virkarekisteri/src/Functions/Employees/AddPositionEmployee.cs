using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Employees;

public class AddPositionEmployee(
    ILogger<AddPositionEmployee> logger,
    IPositionEmployeeRepository repository,
    IPositionChangeLogRepository positionChangeLogRepository,
    IPositionRepository positionRepository
)
{
    [Function("AddPositionEmployee")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = "positionemployees")] HttpRequest req
    )
    {
        logger.LogInformation("Adding new employee to position from JSON POST request body");

        var (error, addPositionEmployeeRequest) = await TryDeserializeRequestBody<AddPositionEmployeeRequestDto>(req);

        if (error is not null)
            return error;

        var requestPosition = addPositionEmployeeRequest.PositionEmployee;
        var decisionNumber = addPositionEmployeeRequest.DecisionNumber;

        if (requestPosition.StartDate > requestPosition.EndingDate)
            return new BadRequestObjectResult("Ending date must be after the starting date.");

        // a position employee can only be added to a filled position if it's a replacement employee
        if (
            !requestPosition.Replacement
            && await repository.IsPositionFilled(requestPosition.PositionId, requestPosition.StartDate)
        )
            return new BadRequestObjectResult("Position is already filled.");

        if (!await repository.IsPositionValid(requestPosition.PositionId, requestPosition.StartDate))
            return new BadRequestObjectResult("Position is not currently valid.");

        var createdPositionEmployee = await repository.CreatePositionEmployee(requestPosition);
        var position = await positionRepository.GetPosition(requestPosition.PositionId);

        if (position == null)
            return new OkObjectResult(createdPositionEmployee);

        if (position.PricingId != null && position.PricingId.Length > 20)
            return new BadRequestObjectResult("PricingId cannot be more than 20 characters.");

        if (requestPosition.Replacement)
        {
            var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
            position.ReplacementEmployeeId = createdPositionEmployee.Id;
            await positionChangeLogRepository.AddPositionChangeLogEntry(
                new PositionChangeLog
                {
                    PositionId = createdPositionEmployee.PositionId,
                    EditedField = "Substitute",
                    OldValue = string.Empty,
                    NewValue = createdPositionEmployee.EmployeeName,
                    Editor = editor,
                    DecisionNumber = decisionNumber ?? "Unknown",
                }
            );
        }
        else
        {
            var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
            position.PositionEmployeeId = createdPositionEmployee.Id;

            if (
                createdPositionEmployee.StartDate.Date <= DateTime.Now.Date
                && (
                    !createdPositionEmployee.EndingDate.HasValue
                    || createdPositionEmployee.EndingDate.Value.Date > DateTime.Now.Date
                )
            )
                position.VacancyStatus = 2;

            await positionChangeLogRepository.AddPositionChangeLogEntry(
                new PositionChangeLog
                {
                    PositionId = createdPositionEmployee.PositionId,
                    EditedField = "CreatedEmployee",
                    OldValue = string.Empty,
                    NewValue = createdPositionEmployee.EmployeeName,
                    Editor = editor,
                    DecisionNumber = decisionNumber ?? "Unknown",
                }
            );
        }

        await positionRepository.UpdatePosition(position);

        return new OkObjectResult(createdPositionEmployee);
    }
}
