CREATE TABLE [dbo].[Customer] (
    [UserID]      INT           NOT NULL,
    [Balance]     FLOAT (53)    NOT NULL,
    [Payment_Log] VARCHAR (255) NOT NULL,
    PRIMARY KEY CLUSTERED ([UserID] ASC),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([UserID]) ON DELETE CASCADE ON UPDATE CASCADE
);

