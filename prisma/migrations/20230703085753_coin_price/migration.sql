/*
  Warnings:

  - You are about to drop the column `decimals` on the `Coin` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Coin` table. All the data in the column will be lost.
  - Made the column `contract` on table `Coin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Coin" DROP COLUMN "decimals",
DROP COLUMN "price",
ADD COLUMN     "usdPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "contract" SET NOT NULL;
