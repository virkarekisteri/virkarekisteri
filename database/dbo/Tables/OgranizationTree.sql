CREATE TABLE [dbo].[OrganizationTree] (
    [Number] NVARCHAR(50) NOT NULL, -- Not unique on its own, need Alue as well
    [Name] NVARCHAR(255) NOT NULL,
    [ParentNumber] NVARCHAR(50), -- NULL for highest-level
    [Alue] NVARCHAR(255) NOT NULL, -- (Palvelukeskus, Tulosalue, Vastuualue, Tulosyksikkö, Kustannuspaikka)
    CONSTRAINT [PK_OrganizationTree] PRIMARY KEY ([Number], [Alue]), -- Composite primary key
    CONSTRAINT [FK_OrganizationTree_Parent] FOREIGN KEY ([ParentNumber], [Alue]) REFERENCES [dbo].[OrganizationTree] ([Number], [Alue])
);

GO
