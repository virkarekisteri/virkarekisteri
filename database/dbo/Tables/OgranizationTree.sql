CREATE TABLE [dbo].[OrganizationTree] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY, -- New GUID column for unique identification
    [Number] NVARCHAR(50) NOT NULL, -- Not unique on its own, need Alue as well
    [Name] NVARCHAR(255) NOT NULL,
    [ParentNumber] NVARCHAR(50) NULL, -- NULL for highest-level
    [Alue] NVARCHAR(255) NOT NULL, -- (Palvelukeskus, Tulosalue, Vastuualue, Tulosyksikkö, Kustannuspaikka)
    [ParentAlue] NVARCHAR(255) NULL, -- Nullable for the foreign key reference
    CONSTRAINT [UQ_OrganizationTree] UNIQUE ([Number], [Alue]), -- Unique constraint on Number and Alue
    CONSTRAINT [FK_OrganizationTree_Parent] FOREIGN KEY ([ParentNumber], [ParentAlue]) 
    REFERENCES [dbo].[OrganizationTree] ([Number], [Alue]) ON DELETE NO ACTION -- No cascading action
);

GO
