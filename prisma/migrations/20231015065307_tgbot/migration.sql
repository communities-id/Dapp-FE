/*
  Warnings:

  - A unique constraint covering the columns `[tgGroupID]` on the table `Community` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TelegramUser_userId_key";

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "tgGroupID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Community_tgGroupID_key" ON "Community"("tgGroupID");
