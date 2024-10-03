﻿using System.ComponentModel.DataAnnotations;
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

    [Column("VakanssiKoko")]
    public decimal? VacancySize { get; set; }

    [Column("VakanssinTaytto")]
    public decimal? VacancyFill { get; set; }

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
}