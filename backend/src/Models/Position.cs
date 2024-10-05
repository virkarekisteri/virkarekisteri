using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models;

[Table("Positions")]
public class Position
{
    public Guid Id { get; init; }

    [Required]
    [Column("LuontiPvm")]
    public DateTime CreatedAt { get; init; }

    [Column("PaattymisPvm")]
    public DateTime? EndedAt { get; init; }

    [Column("VakanssiKoko", TypeName = "decimal(3, 2)")]
    public decimal? VacancySize { get; init; }

    [Column("VakanssinTaytto", TypeName = "decimal(3, 2)")]
    public decimal? VacancyFill { get; init; }

    [Required]
    [MaxLength(100)]
    [Column("LuontiPaatosNumero")]
    public required string CreationDecisionNumber { get; init; }

    [MaxLength(100)]
    [Column("LopetusPaatosNumero")]
    public string? EndingDecisionNumber { get; init; }

    [Required]
    [Column("Laji")]
    public int Type { get; init; }
}
