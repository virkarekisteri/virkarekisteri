namespace Virkarekisteri.Models;

public class UpdatePositionNameDto
{
    public string Name { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidUntil { get; set; }
}
