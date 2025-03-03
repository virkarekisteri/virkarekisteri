CREATE TABLE [dbo].[PositionSubject] (
    PositionId UNIQUEIDENTIFIER NOT NULL 
        CONSTRAINT FK_PositionSubject_Positions 
        FOREIGN KEY REFERENCES Positions(Id) 
        ON DELETE CASCADE,

    SubjectId UNIQUEIDENTIFIER NOT NULL 
        CONSTRAINT FK_PositionSubject_Subjects 
        FOREIGN KEY REFERENCES Subjects(Id) 
        ON DELETE CASCADE,

    PRIMARY KEY (PositionId, SubjectId)
);

GO
