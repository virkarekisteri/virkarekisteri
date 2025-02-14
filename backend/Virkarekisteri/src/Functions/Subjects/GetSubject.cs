using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.Subjects;

public class GetPosition(ILogger<GetPosition> logger, ISubjectRepository subjectRepository)
{
    /// <summary>
    /// Gets a subject by id
    /// </summary>
    /// <param name="req">Input GET request containing the ID</param>
    /// <returns>
    /// The subject with the given ID
    /// </returns>
    [Function("GetSubject")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "subjects/{id}")] HttpRequest req
    )
    {
        logger.LogInformation("Getting subject by id: {Id}", req.RouteValues["id"]);

        if (!Guid.TryParse(req.RouteValues["id"] as string, out var subjectId))
            return new BadRequestObjectResult($"Failed to parse {req.RouteValues["id"]} as a Guid");

        var subject = await subjectRepository.GetSubject(subjectId);

        if (subject is null)
            return new NotFoundResult();

        return new OkObjectResult(subject);
    }
}