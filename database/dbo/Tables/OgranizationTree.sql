CREATE TABLE [dbo].[OrganizationTree] (
    [Number] NVARCHAR(50) PRIMARY KEY, -- Unique identifier
    [Name] NVARCHAR(255) NOT NULL,
    [ParentNumber] NVARCHAR(50), -- NULL for highest-level
    [Alue] NVARCHAR(255) NOT NULL, -- (Palvelukeskus, Tulosalue, Vastuualue, Tulosyksikkö, Kustannuspaikka)
    CONSTRAINT [FK_OrganizationTree_Parent] FOREIGN KEY ([ParentNumber]) REFERENCES [dbo].[OrganizationTree]([Number]) ON DELETE CASCADE
);

GO
