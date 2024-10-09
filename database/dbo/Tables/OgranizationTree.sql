CREATE TABLE [dbo].[OrganizationTree] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Number] NVARCHAR(50) NOT NULL,
    [Name] NVARCHAR(255) NOT NULL,
    [ParentId] UNIQUEIDENTIFIER,
    [Alue] NVARCHAR(255), 
    [Palvelukeskus] NVARCHAR(255), 
    [Tulosalue] NVARCHAR(255), 
    [Vastuualue] NVARCHAR(255), 
    [Tulosyksikkö] NVARCHAR(255), 
    [Kustannuspaikka] NVARCHAR(255), 
    CONSTRAINT [FK_OrganizationTree_Parent] FOREIGN KEY ([ParentId]) REFERENCES [dbo].[OrganizationTree]([Id]) ON DELETE CASCADE
);

GO
