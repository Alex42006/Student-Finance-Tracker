-- CreateEnum
CREATE TYPE "RepeatInterval" AS ENUM ('SEMESTER', 'YEAR', 'MONTH');

-- CreateTable
CREATE TABLE "FinancialAid" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "aidType" TEXT NOT NULL,
    "amountAwarded" DOUBLE PRECISION NOT NULL,
    "term" TEXT NOT NULL,
    "disbursementDate" TIMESTAMP(3) NOT NULL,
    "repeats" BOOLEAN NOT NULL DEFAULT false,
    "repeatInterval" "RepeatInterval",
    "nextOccurrence" TIMESTAMP(3),

    CONSTRAINT "FinancialAid_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FinancialAid" ADD CONSTRAINT "FinancialAid_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
