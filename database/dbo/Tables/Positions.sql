CREATE TABLE [dbo].[Positions] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Vakanssinumero] NVARCHAR(8) NULL,
    [LuontiPvm] DATETIME NOT NULL,
    [PaattymisPvm] DATETIME,
    [VakanssiKoko] DECIMAL(3, 2),
    [VakanssinTaytto] DECIMAL(3, 2),
    [Hinnoittelutunnus] NVARCHAR(20),
    [LuontiPaatosNumero] NVARCHAR(100) NOT NULL,
    [LopetusPaatosNumero] NVARCHAR(50),
    [Laji] INT NOT NULL,
    [Sijoituspaikka] NVARCHAR(50),
    [PositionNameId] UNIQUEIDENTIFIER CONSTRAINT [FK_Positions_PositionNames] FOREIGN KEY ([PositionNameId]) REFERENCES [dbo].[PositionNames] ([Id]),
    [Koulutustaso] NVARCHAR(255),
    [Tyokokemus] NVARCHAR(255),
    [Lisatiedot] NVARCHAR(255),
    [PositionEmployeeId] UNIQUEIDENTIFIER CONSTRAINT [FK_Positions_PositionEmployee] FOREIGN KEY ([PositionEmployeeId]) REFERENCES [dbo].[PositionEmployee] ([Id]),
    [ReplacementEmployeeId] UNIQUEIDENTIFIER CONSTRAINT [FK_Positions_PositionReplacementEmployee] FOREIGN KEY ([ReplacementEmployeeId]) REFERENCES [dbo].[PositionEmployee] ([Id]),
    [CostcentreId] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [FK_Positions_Costcentres] FOREIGN KEY ([CostcentreId]) REFERENCES [dbo].[Costcentres] ([Id]),
    [VakanssinTila] INT NOT NULL DEFAULT 1,
    [OnOpettaja] BIT CONSTRAINT [DEFAULT_Positions_OnkoOpettaja] DEFAULT ((0)) NOT NULL
);

GO
