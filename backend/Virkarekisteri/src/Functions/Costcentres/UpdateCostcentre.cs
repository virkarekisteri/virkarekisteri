using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using Virkarekisteri.src.Models;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Costcentres;

// PUT /costcentres/{id}
public class UpdateCostcentre(
    ILogger<UpdateCostcentre> logger,
    ICostcentreRepository costcentreRepository
// TODO CRUD: IChangeLogRepository changeLogRepository
)
{
    /// <summary>
    /// Updates a costcentre in the database
    /// </summary>
    /// <param name="req">Input PUT request with body containing Costcentre to update</param>
    /// <param name="id">The ID of the costcentre to update</param>
    /// <returns>
    /// No content on success or an error
    /// </returns>
    [Function("UpdateCostcentre")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "PUT", Route = "costcentres/{id}")] HttpRequest req,
        string id
    )
    {
        logger.LogInformation("1/3 : Updating costcentre with ID: {Id}", id);

        if (!Guid.TryParse(id, out var costcentreId))
            return new BadRequestObjectResult($"Invalid ID format: {id}");

        // Deserialize payload into UpdateCostcentreDto
        var (error, updateDto) = await TryDeserializeRequestBody<UpdateCostcentreDto>(req);

        if (error != null)
            return error;

        // Fetch the existing costcentre from the database
        var existingCostcentre = await costcentreRepository.GetCostcentreById(costcentreId);
        if (existingCostcentre == null)
            return new NotFoundResult();

        // TODO: Update values and handle the logging
    }
}
