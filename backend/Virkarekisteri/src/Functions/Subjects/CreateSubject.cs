using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using static Virkarekisteri.Utils.DeserializeHelper;

namespace Virkarekisteri.Functions.Subjects;

public class CreateSubject(
    ILogger<CreateSubject> logger,
    ISubjectRepository subjectRepository,
    IChangeLogRepository changeLogRepository
)
{
    /// <summary>
    /// /subjects POST endpoint to add a new subject to the database    
    /// </summary>
    /// <param name="req">Input POST request with body containing Subject to create</param>
    /// <returns>
    /// The created subject
    /// </returns>
    [Function("CreateSubject")]
    [RequiresEditRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = "subjects")] HttpRequest req
    )
    {
        logger.LogInformation("Creating a new subject from JSON POST request body");

        var (error, requestSubject) = await TryDeserializeRequestBody<Subject>(req);

        if (error is not null)
            return error;
        
        if (requestSubject.SubjectName == String.Empty)
        {
            return new BadRequestObjectResult("Subject's name must be provided.");
        }

        var subject = await subjectRepository.CreateSubject(requestSubject);

        // TODO: Logitus uuden aineen lisäämisestä. Vaatinee oman taulunsa?
        /*
        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
        var changeLog = new ChangeLog
        {
            Id = Guid.NewGuid(),
            PositionId = createdPosition.Id,
            EditedField = "CreatedPosition",
            OldValue = string.Empty,
            NewValue = createdPosition.VacancyNumber ?? string.Empty,
            Editor = editor,
            Timestamp = DateTime.Now,
            DecisionNumber = createdPosition.CreationDecisionNumber,
        };
        await changeLogRepository.AddChangeLogEntry(changeLog);
        */

        return new OkObjectResult(subject);
    }
}