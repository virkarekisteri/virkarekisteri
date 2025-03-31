using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models;

[Table("PositionNames")]
public class PositionName
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(255)]
    [Column("Name")]
    public required string Name { get; set; }

    [Column("ValidFrom")]
    public DateTime? ValidFrom { get; set; }

    [Column("ValidUntil")]
    public DateTime? ValidUntil { get; set; }
}
