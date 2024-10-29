namespace Virkarekisteri.Models
{
    public class UpdatePositionDto
    {
        public DateTime? EndedAt { get; set; }
        public string? EndingDecisionNumber { get; set; }
        public string? PositionName { get; set; }
        public decimal? VacancyFill { get; set; }
        public string? PlacementLocation { get; set; }
    }
}
