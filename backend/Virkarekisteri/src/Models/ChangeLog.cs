using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models;

[Table("ChangeLog")]
public class ChangeLog
{
    public Guid Id { get; set; }

    [Required]
    [Column("VirkaId")]
    public Guid PositionId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("MuokattuKentta")]
    public required string EditedField { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("VanhaArvo")]
    public required string OldValue { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("UusiArvo")]
    public required string NewValue { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("Muokkaaja")]
    public required string Editor { get; set; }

    [Required]
    [Column("Timestamp")]
    public DateTime Timestamp { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("PaatosNumero")]
    public required string DecisionNumber { get; set; }
}
