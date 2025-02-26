namespace Virkarekisteri.Models;

public class UpdatePositionDto
{
    public DateTime? EndedAt { get; set; }
    public string? EndingDecisionNumber { get; set; }
    public string? PlacementLocation { get; set; }
    public decimal? VacancyFill { get; set; }
    public decimal? VacancySize { get; set; }
    public string? PricingId { get; set; }
    public string? EducationLevel { get; set; }
    public string? WorkExperience { get; set; }
    public string? Details { get; set; }
    public int? Type { get; set; }
    public Guid? OrgTreeId { get; set; }
    public PositionNameDto? PositionName { get; set; }
    public string? DecisionNumber { get; set; }
    public int? VacancyStatus { get; set; }
    public bool? IsTeacher { get; set; }
    public List<Guid>? SubjectIds { get; set; } = new List<Guid>();
}

public class PositionNameDto
{
    public string? Name { get; set; }
}
