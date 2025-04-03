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
    ICRUDChangeLogRepository CRUDChangeLogRepository
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

        // Call repository to check if subject exists before adding
        var (exists, existingSubject) = await subjectRepository.CreateSubject(requestSubject);

        if (exists)
        {
            return new ConflictObjectResult(
                new { message = "A subject with this name already exists.", existingObject = existingSubject }
            );
        }

        var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
        var CRUDChangeLog = new CRUDChangeLog
        {
            Id = Guid.NewGuid(),
            ObjectType = "Subject",
            ObjectId = requestSubject.Id,
            EditedField = "CreatedSubject",
            OldValue = string.Empty,
            NewValue = requestSubject.SubjectName,
            Editor = editor,
            Timestamp = DateTime.Now,
        };
        await CRUDChangeLogRepository.AddCRUDChangeLogEntry(CRUDChangeLog);

        return new OkObjectResult(requestSubject);
    }
}
