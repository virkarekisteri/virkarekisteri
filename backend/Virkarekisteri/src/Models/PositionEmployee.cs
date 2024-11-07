using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models;

[Table("PositionEmployee")]
public class PositionEmployee
{
    public Guid Id { get; set; }

    [Required]
    [Column("AlkamisPvm")]
    public DateTime StartDate { get; set; }

    [Column("PaattymisPvm")]
    public DateTime? EndingDate { get; set; }

    [Required]
    [Column("VirkaId")]
    public Guid PositionId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("Nimi")]
    public required string EmployeeName { get; set; }
}
