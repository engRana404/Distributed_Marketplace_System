CREATE TABLE [dbo].[Tags] (
    [Title]       INT           IDENTITY (1, 1) NOT NULL,
    [Description] VARCHAR (255) NOT NULL,
    PRIMARY KEY CLUSTERED ([Title] ASC)
);

