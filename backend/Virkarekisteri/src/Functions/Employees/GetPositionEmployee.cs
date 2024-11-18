using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.Employees;

public class GetPositionEmployee(
    ILogger<GetPositionEmployee> logger,
    IPositionEmployeeRepository positionEmployeeRepository
)
{
    /// <summary>
    /// Gets a position employee by id
    /// </summary>
    /// <param name="req">Input GET request containing the ID</param>
    /// <returns>
    /// The position employee with the given ID
    /// </returns>
    [Function("GetPositionEmployee")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "positionemployees/{id}")] HttpRequest req
    )
    {
        var sanitizedId = (req.RouteValues["id"] as string)
            ?.Replace(Environment.NewLine, "")
            .Replace("\n", "")
            .Replace("\r", "");
        logger.LogInformation("Getting position employee by id: {Id}", sanitizedId);

        if (!Guid.TryParse(req.RouteValues["id"] as string, out var positionEmployeeId))
            return new BadRequestObjectResult($"Failed to parse {req.RouteValues["id"]} as a Guid");

        var positionEmployee = await positionEmployeeRepository.GetPositionEmployee(positionEmployeeId);

        if (positionEmployee is null)
            return new NotFoundResult();

        return new OkObjectResult(positionEmployee);
    }
}
