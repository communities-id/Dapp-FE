/*
  Warnings:

  - A unique constraint covering the columns `[brand]` on the table `TelegramGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[regisrty]` on the table `TelegramGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId]` on the table `TelegramGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `TelegramUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `TelegramUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TelegramGroup_brand_regisrty_groupId_key";

-- DropIndex
DROP INDEX "TelegramUser_address_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TelegramGroup_brand_key" ON "TelegramGroup"("brand");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramGroup_regisrty_key" ON "TelegramGroup"("regisrty");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramGroup_groupId_key" ON "TelegramGroup"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramUser_address_key" ON "TelegramUser"("address");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramUser_userId_key" ON "TelegramUser"("userId");
