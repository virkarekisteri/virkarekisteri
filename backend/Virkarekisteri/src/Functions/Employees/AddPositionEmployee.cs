using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Functions.Positions;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Employees;

public class AddPositionEmployee(
    ILogger<AddPositionEmployee> logger,
    IPositionEmployeeRepository repository,
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

        var (error, requestPosition) = await TryDeserializeRequestBody<PositionEmployee>(req);

        if (error is not null)
            return error;

        if (requestPosition.StartDate > requestPosition.EndingDate)
        {
            return new BadRequestObjectResult("Ending date must be after the starting date.");
        }

        if (await repository.IsPositionFilled(requestPosition.PositionId, requestPosition.StartDate))
        {
            return new BadRequestObjectResult("Position is already filled.");
        }

        if (!await repository.IsPositionValid(requestPosition.PositionId, requestPosition.StartDate))
        {
            return new BadRequestObjectResult("Position is not currently valid.");
        }

        var createdPositionEmployee = await repository.CreatePositionEmployee(requestPosition);

        var position = await positionRepository.GetPosition(requestPosition.PositionId);

        if (position != null)
        {
            position.PositionEmployeeId = createdPositionEmployee.Id;

            await positionRepository.UpdatePosition(position);
        }
        var position2 = await positionRepository.GetPosition(requestPosition.PositionId);

        return new OkObjectResult(createdPositionEmployee);
    }
}
