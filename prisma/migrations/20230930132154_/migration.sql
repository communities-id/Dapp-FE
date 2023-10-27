/*
  Warnings:

  - You are about to drop the column `regisrty` on the `TelegramGroup` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registry]` on the table `TelegramGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registry` to the `TelegramGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TelegramGroup_regisrty_key";

-- AlterTable
ALTER TABLE "TelegramGroup" DROP COLUMN "regisrty",
ADD COLUMN     "registry" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TelegramGroup_registry_key" ON "TelegramGroup"("registry");
