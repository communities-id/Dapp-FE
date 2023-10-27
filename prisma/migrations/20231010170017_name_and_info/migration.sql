/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Community` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `communityInfo` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberInfo` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "communityInfo" JSONB NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "memberInfo" JSONB NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Member_name_key" ON "Member"("name");
