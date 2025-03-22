namespace Virkarekisteri.Models;

public class UpdateCostcentreDto
{
    public int? Number { get; set; }
    public string Name { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidUntil { get; set; }
}
