CREATE TABLE [dbo].[User] (
    [UserID]   INT           IDENTITY (1, 1) NOT NULL,
    [Name]     VARCHAR (100) NOT NULL,
    [Email]    VARCHAR (100) NOT NULL,
    [Password] VARCHAR (100) NOT NULL,
    [Pic]      VARCHAR (255) NOT NULL,
    PRIMARY KEY CLUSTERED ([UserID] ASC),
    UNIQUE NONCLUSTERED ([Email] ASC)
);

