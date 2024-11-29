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

        var (error, requestEmployee) = await TryDeserializeRequestBody<PositionEmployee>(req);

        if (error is not null)
            return error;

        if (requestEmployee == null)
            return new BadRequestObjectResult("Invalid request body");

        var existingPositionEmployee = await positionEmployeeRepository.GetPositionEmployee(positionEmployeeId);

        if (existingPositionEmployee == null)
            return new NotFoundResult();

        if (!requestEmployee.InLeave && existingPositionEmployee.InLeave)
        {
            var position = await positionRepository.GetPosition(requestEmployee.PositionId);
            if (position == null)
                return new BadRequestObjectResult("Position not found");

            position.ReplacementEmployeeId = null;
            await positionRepository.UpdatePosition(position);
        }

        // Update the existing position employee with the new values
        existingPositionEmployee.StartDate = requestEmployee.StartDate;
        existingPositionEmployee.EndingDate = requestEmployee.EndingDate;
        existingPositionEmployee.PositionId = requestEmployee.PositionId;
        existingPositionEmployee.EmployeeName = requestEmployee.EmployeeName;
        existingPositionEmployee.Replacement = requestEmployee.Replacement;
        existingPositionEmployee.InLeave = requestEmployee.InLeave;



        await positionEmployeeRepository.UpdatePositionEmployee(existingPositionEmployee);

        return new OkObjectResult(existingPositionEmployee);
    }
}
