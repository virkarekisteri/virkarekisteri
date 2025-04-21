using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Middleware.Attributes;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.Positions;

public class CreatePositionsFromCsv(
    ILogger<CreatePositionsFromCsv> logger,
    IPositionRepository positionRepository,
    IPositionNameRepository positionNameRepository,
    IPositionChangeLogRepository positionChangeLogRepository,
    ISubjectRepository subjectRepository,
    ICostcentreRepository costcentreRepository
)
{
    [Function("CreatePositionsFromCsv")]
    [RequiresAdminRole]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = "positions/import")] HttpRequest req
    )
    {
        logger.LogInformation("Processing CSV file upload for multiple positions.");

        if (!req.Form.Files.Any())
        {
            return new BadRequestObjectResult("CSV-tiedostoa ei ole ladattu.");
        }

        var file = req.Form.Files[0];

        if (file.Length == 0)
        {
            return new BadRequestObjectResult("Ladattu tiedosto on tyhjä.");
        }

        // preload all subjects once
        var allSubjects = await subjectRepository.GetSubjects();
        var subjectDictionary = allSubjects.ToDictionary(s => s.SubjectName.ToLowerInvariant(), s => s.Id);

        var positions = new List<Position>();
        var errors = new List<string>();

        int totalLines = 0;

        using (var reader = new StreamReader(file.OpenReadStream()))
        {
            // Skip the header line
            var headerLine = await reader.ReadLineAsync();
            int lineNumber = 2;

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (line == null)
                {
                    continue;
                }
                totalLines++;

                var values = line.Split(';');

                try
                {
                    var position = new Position { CreationDecisionNumber = values[3] };

                    if (string.IsNullOrWhiteSpace(position.CreationDecisionNumber))
                    {
                        throw new Exception("Päätösnumero on pakollinen eikä se voi olla tyhjä.");
                    }

                    if (
                        string.IsNullOrWhiteSpace(values[2])
                        || !DateTime.TryParse(
                            values[2],
                            CultureInfo.InvariantCulture,
                            DateTimeStyles.None,
                            out var createdAt
                        )
                    )
                    {
                        throw new Exception(
                            "Perustamisajankohta on pakollinen ja sen on oltava kelvollinen päivämäärä."
                        );
                    }
                    position.CreatedAt = createdAt;

                    if (string.IsNullOrWhiteSpace(values[4]) || !int.TryParse(values[4], out var type))
                    {
                        throw new Exception("Laji on pakollinen ja sen on oltava kelvollinen kokonaisluku.");
                    }
                    position.Type = type;

                    // Handle costcentre from CSV
                    var costcentreNumber = values[0];
                    var costcentreId = await positionRepository.GetCostcentreIdByNumber(costcentreNumber);
                    if (costcentreId == Guid.Empty)
                    {
                        throw new Exception(
                            $"Virheellinen kustannuspaikan numero '{costcentreNumber}'. Lisää kustannuspaikka järjestelmään tai käytä löytyvää numeroa."
                        );
                    }

                    var costcentre = await costcentreRepository.GetCostcentreById(costcentreId);
                    var now = DateTime.Now;
                    if (
                        (costcentre.ValidFrom.HasValue && costcentre.ValidFrom.Value > now)
                        || (costcentre.ValidUntil.HasValue && costcentre.ValidUntil.Value < now)
                    )
                    {
                        throw new Exception(
                            $"Kustannuspaikka '{costcentreNumber}' ei ole voimassa tällä hetkellä. Tarkista voimassaolotiedot."
                        );
                    }
                    position.CostcentreId = costcentre.Id;

                    // Handle position name from CSV
                    var positionNameName = values[1];
                    var positionNameId = await positionNameRepository.GetPositionNameIdByName(positionNameName);
                    if (positionNameId == Guid.Empty || !positionNameId.HasValue)
                    {
                        throw new Exception(
                            $"Virheellinen virkanimike '{positionNameName}'. Lisää virkanimike järjestelmään tai käytä löytyvää virkanimikettä."
                        );
                    }

                    var positionName = await positionNameRepository.GetPositionNameById(positionNameId.Value);
                    if (
                        (positionName.ValidFrom.HasValue && positionName.ValidFrom.Value > now)
                        || (positionName.ValidUntil.HasValue && positionName.ValidUntil.Value < now)
                    )
                    {
                        throw new Exception(
                            $"Virkanimike '{positionNameName}' ei ole voimassa tällä hetkellä. Tarkista voimassaolotiedot."
                        );
                    }
                    position.PositionNameId = positionName.Id;

                    position.EndedAt = string.IsNullOrWhiteSpace(values[5])
                        ? (DateTime?)null
                        : DateTime.Parse(values[5], CultureInfo.InvariantCulture);
                    // Set VacancyStatus = 1 if no end date or end date is in the future
                    if (!position.EndedAt.HasValue || position.EndedAt.Value.Date > DateTime.Now.Date)
                    {
                        position.VacancyStatus = 1; // 1 = Established
                    }
                    else
                    {
                        position.VacancyStatus = 0; // 0 = Abolished
                    }

                    position.EndingDecisionNumber = string.IsNullOrWhiteSpace(values[6]) ? null : values[6];
                    position.VacancySize = string.IsNullOrWhiteSpace(values[7])
                        ? (decimal?)null
                        : decimal.Parse(values[7], NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture);
                    position.VacancyFill = string.IsNullOrWhiteSpace(values[8])
                        ? (decimal?)null
                        : decimal.Parse(values[8], NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture);
                    position.PricingId = string.IsNullOrWhiteSpace(values[9]) ? null : values[9];
                    position.EducationLevel = string.IsNullOrWhiteSpace(values[10]) ? null : values[10];
                    position.WorkExperience = string.IsNullOrWhiteSpace(values[11]) ? null : values[11];
                    position.Details = string.IsNullOrWhiteSpace(values[12]) ? null : values[12];
                    position.PlacementLocation = string.IsNullOrWhiteSpace(values[13]) ? null : values[13];

                    var teacherSubjectsRaw = values[14];
                    if (!string.IsNullOrWhiteSpace(teacherSubjectsRaw))
                    {
                        var splittedSubjects = teacherSubjectsRaw.Split(',', StringSplitOptions.RemoveEmptyEntries);
                        foreach (var subjectString in splittedSubjects)
                        {
                            var lowerSubject = subjectString.Trim().ToLowerInvariant();
                            if (!subjectDictionary.TryGetValue(lowerSubject, out var subjectId))
                            {
                                // if the subject is not found throw an exception to skip the entire position
                                throw new Exception($"Aine '{subjectString}' ei löytynyt järjestelmästä.");
                            }
                            position.SubjectIds.Add(subjectId);
                        }
                        if (position.SubjectIds.Count > 0)
                        {
                            position.IsTeacher = true;
                        }
                    }

                    position.PositionEmployeeId = null; // can't be set from CSV
                    position.VacancyNumber = null; // auto-generated

                    positions.Add(position); // Add to the list if all validations pass
                }
                catch (Exception ex)
                {
                    // Log the error and continue with the next line
                    var error = $"Virhe CSV:n rivillä {lineNumber}: {ex.Message}";
                    errors.Add(error);
                    logger.LogError(error);
                }

                lineNumber++;
            }
        }

        // Only save positions if no errors occurred
        if (!errors.Any())
        {
            foreach (var position in positions)
            {
                try
                {
                    var createdPosition = await positionRepository.CreatePosition(position);

                    var editor = req.HttpContext.Items["Editor"] as string ?? "Unknown";
                    var positionChangeLog = new PositionChangeLog
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
                    await positionChangeLogRepository.AddPositionChangeLogEntry(positionChangeLog);
                }
                catch (Exception ex)
                {
                    var error = $"Viran tallennus epäonnistui kustannuspaikalla {position.CostcentreId}: {ex.Message}";
                    errors.Add(error);
                    logger.LogError(error);
                }
            }
        }

        // Return response with success message and errors
        var response = new
        {
            Message = errors.Any() ? "Virkoja ei tuotu, virheitä esiintyi." : "Virat tuotu onnistuneesti.",
            SuccessCount = totalLines - errors.Count,
            Errors = errors,
        };

        return new OkObjectResult(response);
    }
}
