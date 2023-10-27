/*
  Warnings:

  - A unique constraint covering the columns `[brand,regisrty,groupId]` on the table `TelegramGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address,userId]` on the table `TelegramUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TelegramGroup_brand_regisrty_groupId_key" ON "TelegramGroup"("brand", "regisrty", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramUser_address_userId_key" ON "TelegramUser"("address", "userId");
