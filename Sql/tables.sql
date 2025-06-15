CREATE TABLE Pictures (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    Description NVARCHAR(250) NULL,
    Date DATETIME NULL,
    FileName NVARCHAR(250) NOT NULL,
    Content VARBINARY(MAX) NOT NULL
);

-- Enforce unique constraint on FileName
CREATE UNIQUE INDEX IX_Pictures_FileName ON Pictures(FileName);
