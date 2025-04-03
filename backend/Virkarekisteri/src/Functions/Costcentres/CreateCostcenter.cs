using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.src.Functions.Costcentres;

public class CreateCostcentre(
    ILogger<CreateCostcentre> logger,
    ICostcentreRepository costcentreRepository,
    ICRUDChangeLogRepository CRUDChangeLogRepository
)
{
    /// <summary>
    /// Creates a costcentre in the database
    /// </summary>
    /// <param name="req">Input POST request with body containing Costcentre to create</param>
    /// <returns>
    /// The created costcentre
    /// </returns>
    [Function("CreateCostcentre")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = "costcentres")] HttpRequest req
    )
    {
        logger.LogInformation("Creating a new costcentre from JSON POST request body");

        var (error, requestCostcentre) = await TryDeserializeRequestBody<Costcentre>(req);

        if (error is not null)
            return error;

        if (requestCostcentre.Number == 0)
        {
            return new BadRequestObjectResult("Costcentre's number must be provided.");
        }

        if (requestCostcentre.Name == String.Empty)
        {
            return new BadRequestObjectResult("Costcentre's name must be provided.");
        }

        // Call repository to check if costcentre exists before adding
        var (exists, existingCostcentre) = await costcentreRepository.CreateCostcentre(requestCostcentre);

        if (exists)
        {
            return new ConflictObjectResult(
                new
                {
                    message = "A costcentre with this name or number already exists.",
                    existingObject = existingCostcentre,
                }
            );
        }

        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
        var CRUDChangeLog = new CRUDChangeLog
        {
            Id = Guid.NewGuid(),
            ObjectType = "Costcentre",
            ObjectId = requestCostcentre.Id,
            EditedField = "CreatedCostcentre",
            OldValue = string.Empty,
            NewValue = requestCostcentre.Name,
            Editor = editor,
            Timestamp = DateTime.Now,
        };
        await CRUDChangeLogRepository.AddCRUDChangeLogEntry(CRUDChangeLog);

        return new OkObjectResult(requestCostcentre);
    }
}
