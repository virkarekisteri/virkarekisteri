using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models;

public class PositionSubject
{
    [ForeignKey("Position")]
    public Guid PositionId { get; set; }
    public Position Position { get; set; }

    [ForeignKey("Subject")]
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; }
}
