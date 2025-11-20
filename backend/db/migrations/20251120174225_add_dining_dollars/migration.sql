/*
  Warnings:

  - Added the required column `diningDollars` to the `MealSwipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealSwipe" ADD COLUMN     "diningDollars" INTEGER NOT NULL;
