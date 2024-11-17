CREATE TABLE [dbo].[Positions] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Vakanssinumero] NVARCHAR(8) NULL,
    [LuontiPvm] DATETIME NOT NULL,
    [PaattymisPvm] DATETIME,
    [VakanssiKoko] DECIMAL(3, 2),
    [VakanssinTaytto] DECIMAL(3, 2),
    [Hinnoittelutunnus] NVARCHAR(10),
    [LuontiPaatosNumero] NVARCHAR(50) NOT NULL,
    [LopetusPaatosNumero] NVARCHAR(50),
    [Laji] INT NOT NULL,
    [Sijoituspaikka] NVARCHAR(50),
    [PositionNameId] UNIQUEIDENTIFIER CONSTRAINT [FK_Positions_PositionNames] FOREIGN KEY ([PositionNameId]) REFERENCES [dbo].[PositionNames] ([Id]),
    [Koulutustaso] NVARCHAR(255),
    [Tyokokemus] NVARCHAR(255),
    [Lisatiedot] NVARCHAR(255),
    [PositionEmployeeId] UNIQUEIDENTIFIER CONSTRAINT [FK_Positions_PositionEmployee] FOREIGN KEY ([PositionEmployeeId]) REFERENCES [dbo].[PositionEmployee] ([Id]),
    [OrgTreeId] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [FK_Positions_OrganizationTree] FOREIGN KEY ([OrgTreeId]) REFERENCES [dbo].[OrganizationTree] ([Id]),
    [VakanssinTila] INT NOT NULL DEFAULT 0
);

GO
