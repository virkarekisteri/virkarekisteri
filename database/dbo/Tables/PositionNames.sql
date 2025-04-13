CREATE TABLE [dbo].[PositionNames] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Name] NVARCHAR(255) NOT NULL,
    [ValidFrom] DATETIME,
    [ValidUntil] DATETIME
);

GO
