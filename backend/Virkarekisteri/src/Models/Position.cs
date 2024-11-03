using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models;

[Table("Positions")]
public class Position
{
    public Guid Id { get; set; }

    [Required]
    [Column("LuontiPvm")]
    public DateTime CreatedAt { get; set; }

    [Column("PaattymisPvm")]
    public DateTime? EndedAt { get; set; }

    [Column("VakanssiKoko", TypeName = "decimal(3, 2)")]
    public decimal? VacancySize { get; set; }

    [Column("VakanssinTaytto", TypeName = "decimal(3, 2)")]
    public decimal? VacancyFill { get; set; }

    [MaxLength(10)]
    [Column("Hinnoittelutunnus")]
    public string? PricingId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("LuontiPaatosNumero")]
    public required string CreationDecisionNumber { get; set; }

    [MaxLength(100)]
    [Column("LopetusPaatosNumero")]
    public string? EndingDecisionNumber { get; set; }

    [Required]
    [Column("Laji")]
    public int Type { get; set; }

    [Required]
    [Column("PositionNameId")]
    public Guid PositionNameId { get; set; }

    [ForeignKey("PositionNameId")]
    public PositionName? PositionName { get; set; }

    [MaxLength(255)]
    [Column("Koulutustaso")]
    public string? EducationLevel { get; set; }

    [MaxLength(255)]
    [Column("Tyokokemus")]
    public string? WorkExperience { get; set; }

    [MaxLength(255)]
    [Column("Lisatiedot")]
    public string? Details { get; set; }

    [MaxLength(50)]
    [Column("Sijoituspaikka")]
    public string? PlacementLocation { get; set; }

    [Required]
    [Column("OrgTreeId")]
    public Guid OrgTreeId { get; set; }

    [Column("VakanssinTila")]
    public int VacancyStatus
    {
        get
        {
            if (VacancyFill.HasValue && VacancyFill > 0 && !EndedAt.HasValue)
                return 2; // 2 == Active (for now with vacancy fill due to no link with person)
            else if (EndedAt.HasValue)
                return 0; // 0 == Abolished
            else
                return 1; // 1 == Established
        }
    }
}
