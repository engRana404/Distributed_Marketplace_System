CREATE TABLE [dbo].[Product] (
    [PID]         INT           IDENTITY (1, 1) NOT NULL,
    [Price]       FLOAT (53)    NOT NULL,
    [Description] TEXT          NOT NULL,
    [Pic]         VARCHAR (255) NOT NULL,
    [Stock]       INT           NOT NULL,
    [Name]        VARCHAR (100) NOT NULL,
    PRIMARY KEY CLUSTERED ([PID] ASC)
);

