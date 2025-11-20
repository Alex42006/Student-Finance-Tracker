/*
  Warnings:

  - You are about to drop the column `term` on the `FinancialAid` table. All the data in the column will be lost.
  - Added the required column `termSeason` to the `FinancialAid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termYear` to the `FinancialAid` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TermSeason" AS ENUM ('FALL', 'SPRING', 'SUMMER');

-- AlterTable
ALTER TABLE "FinancialAid" DROP COLUMN "term",
ADD COLUMN     "termSeason" "TermSeason" NOT NULL,
ADD COLUMN     "termYear" INTEGER NOT NULL;
