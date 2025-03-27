using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models
{
    [Table("Costcentres")]
    public class Costcentre
    {
        public Guid Id { get; set; }

        [Required]
        [Column("Number")]
        public required int Number { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("Name")]
        public required string Name { get; set; }

        [Column("ValidFrom")]
        public DateTime? ValidFrom { get; set; }

        [Column("ValidUntil")]
        public DateTime? ValidUntil { get; set; }
    }
}
