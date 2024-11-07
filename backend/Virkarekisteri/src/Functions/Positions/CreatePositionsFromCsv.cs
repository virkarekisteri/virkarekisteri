using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using System.Globalization;

namespace Virkarekisteri.Functions.Positions;

public class CreatePositionsFromCsv(    
    ILogger<CreatePositionsFromCsv> logger,
    IPositionRepository positionRepository,
    IPositionNameRepository positionNameRepository
)
{
    [Function("CreatePositionsFromCsv")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = "positions/import")] HttpRequest req
    )
    {
        logger.LogInformation("Processing CSV file upload for multiple positions.");

        if (!req.Form.Files.Any())
        {
            return new BadRequestObjectResult("No CSV file uploaded.");
        }

        var file = req.Form.Files[0];

        if (file.Length == 0)
        {
            return new BadRequestObjectResult("Uploaded file is empty.");
        }

        var positions = new List<Position>();
        var errors = new List<string>();
        
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
                var values = line.Split(';');

                try
                {
                    var position = new Position
                    {
                        CreationDecisionNumber = values[7]
                    };
                    
                    if (string.IsNullOrWhiteSpace(position.CreationDecisionNumber))
                    {
                        throw new Exception("CreationDecisionNumber is required and cannot be null or empty.");
                    }

                    if (string.IsNullOrWhiteSpace(values[2]) || !DateTime.TryParse(values[2], CultureInfo.InvariantCulture, DateTimeStyles.None, out var createdAt))
                    {
                        throw new Exception("CreatedAt is required and must be a valid date.");
                    }
                    position.CreatedAt = createdAt;

                    if (string.IsNullOrWhiteSpace(values[9]) || !int.TryParse(values[9], out var type))
                    {
                        throw new Exception("Type is required and must be a valid integer.");
                    }
                    position.Type = type;

                    var orgTreeNumber = values[0];
                    position.OrgTreeId = await positionRepository.GetOrgTreeIdByNumber(orgTreeNumber);
                    if (position.OrgTreeId == Guid.Empty)
                    {
                        throw new Exception($"Invalid OrgTree number '{orgTreeNumber}'");
                    }

                    var positionName = values[1];
                    position.PositionNameId = (await positionNameRepository.GetPositionNameIdByName(positionName)).GetValueOrDefault();
                    if (position.PositionNameId == Guid.Empty)
                    {
                        throw new Exception($"Invalid Position name '{positionName}'");
                    }

                    position.EndedAt = string.IsNullOrWhiteSpace(values[3]) ? (DateTime?)null : DateTime.Parse(values[3], CultureInfo.InvariantCulture);
                    position.VacancySize = string.IsNullOrWhiteSpace(values[4]) ? (decimal?)null : decimal.Parse(values[4], NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture);
                    position.VacancyFill = string.IsNullOrWhiteSpace(values[5]) ? (decimal?)null : decimal.Parse(values[5], NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture);
                    position.PricingId = string.IsNullOrWhiteSpace(values[6]) ? null : values[6];
                    position.EndingDecisionNumber = string.IsNullOrWhiteSpace(values[8]) ? null : values[8];
                    position.EducationLevel = string.IsNullOrWhiteSpace(values[10]) ? null : values[10];
                    position.WorkExperience = string.IsNullOrWhiteSpace(values[11]) ? null : values[11];
                    position.Details = string.IsNullOrWhiteSpace(values[12]) ? null : values[12];
                    position.PlacementLocation = string.IsNullOrWhiteSpace(values[13]) ? null : values[13];

                    positions.Add(position);  // Add to the list if all validations pass
                }
                catch (Exception ex)
                {
                    // Log the error and continue with the next line
                    var error = $"Error on line {lineNumber}: {ex.Message}";
                    errors.Add(error);
                    logger.LogError(error);
                }

                lineNumber++;
            }
        }

        // Save valid positions
        foreach (var position in positions)
        {
            try
            {
                await positionRepository.CreatePosition(position);
            }
            catch (Exception ex)
            {
                var error = $"Failed to save position with OrgTreeId {position.OrgTreeId}: {ex.Message}";
                errors.Add(error);
                logger.LogError(error);
            }
        }

        // Return response with success message and errors
        var response = new
        {
            Message = "Positions imported with some errors.",
            Errors = errors
        };

        return new OkObjectResult(response);
    }
}
