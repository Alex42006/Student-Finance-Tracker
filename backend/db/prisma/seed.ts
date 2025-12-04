import prisma from "../../src/prisma/client";
import bcrypt from "bcrypt";
import { TermSeason } from "@prisma/client";

function randomDateLastYear(): Date {
  const start = new Date(2024, 11, 4).getTime();
  const end = Date.now();
  return new Date(start + Math.random() * (end - start));
}

function pick<T>(arr: readonly T[]): T {
  if (arr.length === 0) {
    throw new Error("pick() called on empty array");
  }
  return arr[Math.floor(Math.random() * arr.length)]!;
}

async function main() {
  const adminEmail = "GBadmin";
  const adminPassword = "Gators123";

  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        isAdmin: true,
      },
    });
    console.log("Admin created:", adminEmail);
  } else {
    console.log("Admin already exists.");
  }

  const userID = admin.id;

  const existingMS = await prisma.mealSwipe.findFirst({ where: { userID } });

  if (!existingMS) {
    await prisma.mealSwipe.create({
      data: {
        userID,
        swipesTotal: 90,
        swipesUsed: 25,
        diningDollars: 210
      }
    });
  } else {
    await prisma.mealSwipe.update({
      where: { id: existingMS.id },
      data: {
        swipesTotal: 90,
        swipesUsed: 25,
        diningDollars: 210
      }
    });
  }

  const subscriptionData = [
    ["Spotify", 9.99, "monthly"],
    ["Netflix", 15.49, "monthly"],
    ["Apple Music", 10.99, "monthly"],
    ["Disney+", 7.99, "monthly"],
    ["Adobe CC", 19.99, "monthly"],
    ["Xbox Game Pass", 14.99, "monthly"],
    ["Crunchyroll", 7.99, "monthly"],
    ["Amazon Prime", 139, "yearly"],
    ["ChatGPT Plus", 20, "monthly"],
    ["UF Parking Pass", 160, "yearly"],
    ["Discord Nitro", 9.99, "monthly"],
    ["Google One Storage", 2.99, "monthly"],
    ["Gym Membership", 30, "monthly"],
    ["Notion Pro", 4, "monthly"],
    ["Meal Plan Add-on", 150, "semester"],
    ["Car Insurance", 120, "monthly"],
    ["Phone Bill", 85, "monthly"],
    ["Cloud GPU Credits", 25, "monthly"],
    ["HBO Max", 14.99, "monthly"],
    ["Paramount+", 7, "monthly"]
  ] as const;

  await prisma.subscription.deleteMany({ where: { userID } });

  for (const [name, amount, cycle] of subscriptionData) {
    await prisma.subscription.create({
      data: {
        userID,
        name,
        amount,
        billingCycle: cycle,
        description: `${name} subscription`,
        firstPaymentDate: randomDateLastYear()
      },
    });
  }

  const financialAidData: [string, number, TermSeason, number][] = [
    ["Pell Grant", 3200, "FALL", 2024],
    ["Bright Futures", 2100, "FALL", 2024],
    ["UF Grant", 1800, "FALL", 2024],
    ["Loan Subsidized", 2750, "FALL", 2024],

    ["Pell Grant", 3200, "SPRING", 2025],
    ["Bright Futures", 2100, "SPRING", 2025],
    ["UF Grant", 1800, "SPRING", 2025],
    ["Loan Subsidized", 2750, "SPRING", 2025],

    ["Pell Grant", 1600, "SUMMER", 2024],
    ["Loan Unsubsidized", 1500, "SUMMER", 2024],
    ["Scholarship - SHPE", 500, "SUMMER", 2024],
    ["UF Summer Grant", 900, "SUMMER", 2024],
  ];

  await prisma.financialAid.deleteMany({ where: { userID } });

  for (const [aidType, amount, termSeason, termYear] of financialAidData) {
    await prisma.financialAid.create({
      data: {
        userID,
        aidType,
        amountAwarded: amount,
        termSeason,
        termYear,
        disbursementDate: randomDateLastYear(),
        repeats: false
      },
    });
  }

  const budgetCategories = [
    ["Food", 350],
    ["Transportation", 120],
    ["Groceries", 200],
    ["Entertainment", 150],
    ["Shopping", 100],
    ["Health", 80],
    ["Gym", 35],
    ["Supplies", 50],
    ["Gas", 100],
    ["Subscriptions", 60],
    ["Dining Out", 180],
    ["Coffee", 40],
    ["Books", 90],
    ["Travel", 200],
    ["Misc", 75],
  ] as const;

  await prisma.budget.deleteMany({ where: { userID } });

  for (const [category, limit] of budgetCategories) {
    await prisma.budget.create({
      data: {
        userID,
        category,
        limitAmount: limit,
        spentAmount: Number((Math.random() * limit * 1.2).toFixed(2)),
        period: "monthly"
      }
    });
  }

  const expenseCategories = [
    "Food", "Groceries", "Entertainment", "Gas", "Coffee",
    "Shopping", "Dining", "Supplies", "Health", "Misc"
  ] as const;

  const incomeCategories = ["Job", "Refund", "FinancialAid", "Gift"] as const;

  await prisma.transaction.deleteMany({ where: { userID } });

  for (let i = 0; i < 120; i++) {
    const isIncome = Math.random() < 0.33;

    await prisma.transaction.create({
      data: {
        userID,
        category: isIncome
          ? pick(incomeCategories)
          : pick(expenseCategories),
        amount: isIncome
          ? Number((Math.random() * 600 + 50).toFixed(2))
          : Number((Math.random() * 70 + 5).toFixed(2)),
        type: isIncome ? "income" : "expense",
        loggedAt: randomDateLastYear()
      },
    });
  }

}

main().catch((e) => console.error(e));
