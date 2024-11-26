CREATE TABLE [dbo].[PositionEmployee] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [AlkamisPvm] DATE NOT NULL,
    [PaattymisPvm] DATE NULL,
    [VirkaId] UNIQUEIDENTIFIER NOT NULL,
    [Nimi] NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_PositionEmployee_Position FOREIGN KEY (VirkaId) REFERENCES Positions (Id),
	[Sahkoposti] NVARCHAR(255) NULL,
	[Replacement] BIT DEFAULT 0,
	[InLeave] BIT DEFAULT 0
);

GO
