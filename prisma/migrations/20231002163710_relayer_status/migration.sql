/*
  Warnings:

  - Added the required column `status` to the `Relayer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Relayer" ADD COLUMN     "status" INTEGER NOT NULL;
