CREATE TABLE [dbo].[Positions] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [LuontiPvm] DATETIME NOT NULL,
    [PaattymisPvm] DATETIME,
    [VakanssiKoko] DECIMAL(3, 2),
    [VakanssinTaytto] DECIMAL(3, 2),
    [Hinnoittelutunnus] NVARCHAR(10),
    [LuontiPaatosNumero] NVARCHAR(50) NOT NULL,
    [LopetusPaatosNumero] NVARCHAR(50),
    [Laji] INT NOT NULL,
    [PositionNameId] UNIQUEIDENTIFIER CONSTRAINT [FK_Positions_PositionNames] FOREIGN KEY ([PositionNameId]) REFERENCES [dbo].[PositionNames] ([Id]),
);

GO
