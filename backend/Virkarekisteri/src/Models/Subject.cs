using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models;

[Table("Subjects")]
public class Subject
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("Aine")]
    public required string SubjectName { get; set; }

    [Required]
    [Column("Aktiivinen")]
    public bool Active { get; set; }
}
