/*
  Warnings:

  - Added the required column `chainId` to the `TelegramGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TelegramGroup" ADD COLUMN     "chainId" BIGINT NOT NULL;
