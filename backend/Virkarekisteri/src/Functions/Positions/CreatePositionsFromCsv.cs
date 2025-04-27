using System.Globalization;
using System.Text;
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

        // Register code page provider for non-UTF8 encodings (Windows-1252 for Excel CSV) so it supports letters like "ä", "ö"
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        using (var reader = new StreamReader(file.OpenReadStream(), Encoding.GetEncoding(1252)))
        {
            // Skip the header line
            var headerLine = await reader.ReadLineAsync();
            int lineNumber = 2;

            // Expected date formats d.M.yyyy or dd.MM.yyyy
            var dateFormats = new[] { "d.M.yyyy", "dd.MM.yyyy" };

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
                    var position = new Position { CreationDecisionNumber = values[4] };

                    if (string.IsNullOrWhiteSpace(position.CreationDecisionNumber))
                    {
                        throw new Exception("Päätösnumero on pakollinen eikä se voi olla tyhjä.");
                    }

                    // Parse CreatedAt in dd.MM.yyyy
                    if (
                        string.IsNullOrWhiteSpace(values[3])
                        || !DateTime.TryParseExact(
                            values[3],
                            dateFormats,
                            CultureInfo.InvariantCulture,
                            DateTimeStyles.None,
                            out var createdAt
                        )
                    )
                    {
                        throw new Exception("Perustamisajankohta on pakollinen ja sen on oltava muodossa dd.MM.yyyy.");
                    }
                    position.CreatedAt = createdAt;

                    // Parse Type (Laji) as numeric or textual
                    var typeText = values[8]?.Trim();
                    if (string.IsNullOrWhiteSpace(typeText))
                        throw new Exception(
                            "Laji on pakollinen ja sen on oltava kelvollinen kokonaisluku tai tekstiarvo."
                        );
                    int type;
                    if (!int.TryParse(typeText, out type))
                    {
                        // support textual values mapping to numeric codes
                        switch (typeText.ToLowerInvariant())
                        {
                            case "virka":
                            case "position":
                                type = 1;
                                break;
                            case "toimi":
                            case "post":
                                type = 2;
                                break;
                            default:
                                throw new Exception(
                                    "Laji on pakollinen ja sen on oltava kelvollinen kokonaisluku tai yksi seuraavista teksteistä: Virka, Toimi, Position, Post."
                                );
                        }
                    }
                    position.Type = type;

                    // Handle costcentre from CSV
                    var costcentreNumber = values[1];
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
                    var positionNameName = values[0];
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

                    // Parse EndedAt and EndingDecisionNumber together
                    var endedAtText = values[13]?.Trim();
                    var endingDecText = values[14]?.Trim();
                    bool hasEnded = !string.IsNullOrWhiteSpace(endedAtText);
                    bool hasEndingDec = !string.IsNullOrWhiteSpace(endingDecText);
                    if (hasEnded ^ hasEndingDec)
                    {
                        throw new Exception(
                            "Viran lakkautus päivämäärä ja lakkautus päätösnumero on annettava molemmat."
                        );
                    }
                    position.EndedAt = hasEnded
                        ? DateTime.ParseExact(
                            endedAtText,
                            dateFormats,
                            CultureInfo.InvariantCulture,
                            DateTimeStyles.None
                        )
                        : (DateTime?)null;

                    // Set VacancyStatus = 1 if no end date or end date is in the future
                    position.VacancyStatus =
                        !position.EndedAt.HasValue || position.EndedAt.Value.Date > now.Date ? 1 : 0;

                    position.EndingDecisionNumber = hasEndingDec ? endingDecText : null;
                    position.VacancySize = NormalizePercent(values[5]);
                    position.VacancyFill = NormalizePercent(values[6]);
                    position.PricingId = string.IsNullOrWhiteSpace(values[7]) ? null : values[7];
                    position.EducationLevel = string.IsNullOrWhiteSpace(values[10]) ? null : values[10];
                    position.WorkExperience = string.IsNullOrWhiteSpace(values[11]) ? null : values[11];
                    position.Details = string.IsNullOrWhiteSpace(values[12]) ? null : values[12];
                    position.PlacementLocation = string.IsNullOrWhiteSpace(values[2]) ? null : values[2];

                    var teacherSubjectsRaw = values[9];
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

    private static decimal? NormalizePercent(string s)
    {
        if (string.IsNullOrWhiteSpace(s))
            return null;
        var trimmed = s.Trim();
        bool hasPercent = trimmed.EndsWith("%");
        var numText = hasPercent ? trimmed.Substring(0, trimmed.Length - 1).Trim() : trimmed;
        var raw = decimal.Parse(
            numText,
            NumberStyles.AllowDecimalPoint | NumberStyles.AllowLeadingWhite | NumberStyles.AllowTrailingWhite,
            CultureInfo.InvariantCulture
        );
        if (hasPercent)
            return raw / 100m;
        return raw > 1m ? raw / 100m : raw;
    }
}
