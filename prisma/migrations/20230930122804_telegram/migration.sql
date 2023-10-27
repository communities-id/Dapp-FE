-- CreateTable
CREATE TABLE "TelegramGroup" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "regisrty" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "TelegramGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramUser" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TelegramUser_pkey" PRIMARY KEY ("id")
);
