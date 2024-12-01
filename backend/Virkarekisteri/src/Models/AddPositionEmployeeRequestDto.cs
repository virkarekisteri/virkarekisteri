namespace Virkarekisteri.Models;

public class AddPositionEmployeeRequestDto
{
    public required PositionEmployee PositionEmployee { get; set; }
    public string? DecisionNumber { get; set; }
}
