using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models;

public class PositionSubject
{
    [Key]
    [Column(Order = 1)]
    public Guid PositionId { get; set; }

    [ForeignKey("PositionId")]
    public Position Position { get; set; }

    [Key]
    [Column(Order = 2)]
    public Guid SubjectId { get; set; }

    [ForeignKey("SubjectId")]
    public Subject Subject { get; set; }
}
