/*
  Warnings:

  - Added the required column `srcBlock` to the `Relayer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Relayer" ADD COLUMN     "dstBlock" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "srcBlock" BIGINT NOT NULL;
