/*
  Warnings:

  - You are about to alter the column `chainId` on the `Coin` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `chainId` on the `Community` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tokenId` on the `Community` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `blockNumber` on the `Community` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `blockTimestamp` on the `Community` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `latestBlock` on the `Community` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `chainId` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tokenId` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `blockNumber` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `blockTimestamp` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Coin" ALTER COLUMN "chainId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Community" ALTER COLUMN "chainId" SET DATA TYPE INTEGER,
ALTER COLUMN "tokenId" SET DATA TYPE INTEGER,
ALTER COLUMN "blockNumber" SET DATA TYPE INTEGER,
ALTER COLUMN "blockTimestamp" SET DATA TYPE INTEGER,
ALTER COLUMN "latestBlock" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "chainId" SET DATA TYPE INTEGER,
ALTER COLUMN "tokenId" SET DATA TYPE INTEGER,
ALTER COLUMN "blockNumber" SET DATA TYPE INTEGER,
ALTER COLUMN "blockTimestamp" SET DATA TYPE INTEGER;
