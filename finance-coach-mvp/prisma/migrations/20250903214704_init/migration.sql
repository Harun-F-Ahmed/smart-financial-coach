-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "merchant" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "description" TEXT
);
