-- CreateTable
CREATE TABLE "AddTransaction" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AddTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealSwipe" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "swipesTotal" INTEGER NOT NULL,
    "swipesUsed" INTEGER NOT NULL DEFAULT 0,
    "weekStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealSwipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AddTransaction" ADD CONSTRAINT "AddTransaction_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealSwipe" ADD CONSTRAINT "MealSwipe_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
