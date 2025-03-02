using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.Subjects;

public class GetSubjects(ILogger<GetSubjects> logger, ISubjectRepository subjectRepository)
{
    /// <summary>
    /// Gets all subjects from the database
    /// </summary>
    /// <param name="req">Input GET request</param>
    /// <returns>
    /// All subjects in the database
    /// </returns>
    [Function("GetSubjects")]
    [RequiresReadRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "subjects")] HttpRequest req
    )
    {
        logger.LogInformation("Getting all subjects");
        var subjects = await subjectRepository.GetSubjects();
        return new OkObjectResult(subjects);
    }
}
