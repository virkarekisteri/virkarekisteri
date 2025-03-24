using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models;

[Table("CRUDChangeLog")]
public class CRUDChangeLog
{
    public Guid Id { get; set; }

    [Required]
    [Column("ObjektiTyyppi")]
    public required string ObjectType { get; set; }

    [Required]
    [Column("ObjektiId")]
    public Guid ObjectId { get; set; }

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
}
