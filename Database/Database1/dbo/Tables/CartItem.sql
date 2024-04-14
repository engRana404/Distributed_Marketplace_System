﻿CREATE TABLE [dbo].[CartItem] (
    [CartID] INT NOT NULL,
    [PID]    INT NOT NULL,
    PRIMARY KEY CLUSTERED ([CartID] ASC, [PID] ASC),
    FOREIGN KEY ([CartID]) REFERENCES [dbo].[Cart] ([CartID]) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ([PID]) REFERENCES [dbo].[Product] ([PID]) ON DELETE CASCADE ON UPDATE CASCADE
);
