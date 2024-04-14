﻿CREATE TABLE [dbo].[ProductTagMapping] (
    [PID]   INT NOT NULL,
    [Title] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([PID] ASC, [Title] ASC),
    FOREIGN KEY ([PID]) REFERENCES [dbo].[Product] ([PID]) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ([Title]) REFERENCES [dbo].[Tags] ([Title]) ON DELETE CASCADE ON UPDATE CASCADE
);

