CREATE TABLE [dbo].[Orders] (
    [OID]           INT           IDENTITY (1, 1) NOT NULL,
    [Address]       VARCHAR (255) NOT NULL,
    [Total_Price]   FLOAT (53)    NOT NULL,
    [Order_Date]    DATE          NOT NULL,
    [Delivery_Date] DATE          NOT NULL,
    [UserID]        INT           NULL,
    PRIMARY KEY CLUSTERED ([OID] ASC),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Customer] ([UserID]) ON DELETE SET NULL ON UPDATE CASCADE
);

