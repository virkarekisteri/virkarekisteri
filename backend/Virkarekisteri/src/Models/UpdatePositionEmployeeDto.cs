public class UpdatePositionEmployeeDto
{
    public Guid? Id { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndingDate { get; set; }
    public Guid? PositionId { get; set; }
    public string? EmployeeName { get; set; }
    public string? DecisionNumber { get; set; }
}
