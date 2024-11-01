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
        public string? Name { get; set; }

        [Required]
        public string? Number { get; set; }

        public string? ParentNumber { get; set; }

        [Required]
        public string? Alue { get; set; }

        public string? ParentAlue { get; set; }
    }
}