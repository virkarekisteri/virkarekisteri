CREATE TABLE [dbo].[OrganizationTree] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Number] NVARCHAR(50) NOT NULL,
    [Name] NVARCHAR(255) NOT NULL,
    [ParentId] UNIQUEIDENTIFIER, -- NULL for highest-level
    [Alue] NVARCHAR(255) NOT NULL, -- (Palvelukeskus, Tulosalue, Vastuualue, Tulosyksikkö, Kustannuspaikka)
    CONSTRAINT [FK_OrganizationTree_Parent] FOREIGN KEY ([ParentId]) REFERENCES [dbo].[OrganizationTree]([Id]) ON DELETE CASCADE
);

GO
