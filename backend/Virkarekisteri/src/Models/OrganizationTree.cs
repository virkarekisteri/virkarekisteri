using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Virkarekisteri.Models
{
    [Table("OrganizationTree")]
    public class OrganizationTree
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(255)]
        public required string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public required string Number { get; set; }

        [MaxLength(50)]
        public string? ParentNumber { get; set; }

        [Required]
        [MaxLength(255)]
        public required string Alue { get; set; }

        [MaxLength(255)]
        public string? ParentAlue { get; set; }
    }
}
