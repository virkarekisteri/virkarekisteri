using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.ScheduledRuns;

public class PositionUpKeeping(
    ILogger<PositionUpKeeping> logger,
    IPositionRepository positionRepository,
    IPositionEmployeeRepository positionEmployeeRepository
)
{
    [Function("PositionUpKeeping")]
    public async Task Run([TimerTrigger("0 0 4 * * *")] TimerInfo myTimer)
    {
        var currentDate = DateTime.Now;
        logger.LogInformation("Scheduled run to upkeep positions starting at: {Time}", currentDate);

        var positions = await positionRepository.GetPositions();
        var employees = await positionEmployeeRepository.GetPositionEmployees();

        foreach (var position in positions)
        {
            if (position.EndedAt.HasValue && position.EndedAt.Value.Date <= currentDate.Date)
            {
                position.VacancyStatus = 0;
                logger.LogInformation("Position {VacancyNumber} scheduled to end. Ending it", position.VacancyNumber);
                await positionRepository.UpdatePosition(position);
            }
        }

        foreach (var employee in employees)
        {
            var employeePosition = positions.FirstOrDefault(x => x.Id == employee.PositionId);
            if (employeePosition is null)
                continue;

            if (!employee.Replacement)
            {
                if (employee.StartDate.Date <= currentDate.Date && employeePosition.VacancyStatus != 2)
                {
                    employeePosition.VacancyStatus = 2;
                    logger.LogInformation(
                        "Employee {EmployeeId} started working. Marking position {VacancyNumber} as active",
                        employee.Id,
                        employeePosition.VacancyNumber
                    );
                    await positionRepository.UpdatePosition(employeePosition);
                }

                if (
                    employee.EndingDate.HasValue
                    && employee.EndingDate.Value.Date <= currentDate.Date
                    && employeePosition.VacancyStatus != 1
                )
                {
                    employeePosition.VacancyStatus = 1;
                    logger.LogInformation(
                        "Employee {EmployeeId} ended working. Marking position {VacancyNumber} as established",
                        employee.Id,
                        employeePosition.VacancyNumber
                    );
                    await positionRepository.UpdatePosition(employeePosition);
                }
            }
            else
            {
                if (employee.EndingDate.HasValue && employee.EndingDate.Value.Date <= currentDate.Date)
                {
                    employeePosition.ReplacementEmployeeId = null;
                    logger.LogInformation(
                        "Substitute {EmployeeId} ended working. Removing from position {VacancyNumber}",
                        employee.Id,
                        employeePosition.VacancyNumber
                    );
                    await positionRepository.UpdatePosition(employeePosition);
                }
            }
        }
    }
}
