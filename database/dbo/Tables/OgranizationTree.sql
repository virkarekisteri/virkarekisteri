CREATE TABLE [dbo].[OrganizationTree] (
    [Number] NVARCHAR(50), -- Not unique on its own, need Alue as well
    [Name] NVARCHAR(255) NOT NULL,
    [ParentNumber] NVARCHAR(50) NULL, -- NULL for highest-level
    [Alue] NVARCHAR(255) NOT NULL, -- (Palvelukeskus, Tulosalue, Vastuualue, Tulosyksikkö, Kustannuspaikka)
    [ParentAlue] NVARCHAR(255) NULL, -- Nullable for the foreign key reference
    CONSTRAINT [PK_OrganizationTree] PRIMARY KEY ([Number], [Alue]), -- Composite primary key
    CONSTRAINT [FK_OrganizationTree_Parent] FOREIGN KEY ([ParentNumber], [ParentAlue]) REFERENCES [dbo].[OrganizationTree] ([Number], [Alue]) ON DELETE NO ACTION -- No cascading action
);

GO
