using System.ComponentModel.DataAnnotations;

namespace Virkarekisteri.Models;

public class PositionName
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(255)]
    public required string Name { get; set; }
}
