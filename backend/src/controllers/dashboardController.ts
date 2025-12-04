import { Request, Response } from "express";
import prisma from "../prisma/client";

const getDateRange = (view: string) => {
  const now = new Date();
  let startDate: Date;

  switch (view) {
    case "week":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
  }

  return { startDate, endDate: now };
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userID = Number(req.query.userID);
    if (!userID) {
      return res.status(400).json({ error: "Missing userID" });
    }

    const view = (req.query.view as string) || "month";
    const { startDate, endDate } = getDateRange(view);

    const [
      transactions,
      mealSwipe,
      subscriptions,
    ] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userID: Number(userID),
        },
      }),

      prisma.mealSwipe.findFirst({
        where: { userID: Number(userID) },
      }),

      prisma.subscription.findMany({
        where: { userID: Number(userID) },
      }),
    ]);

    const filteredTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.loggedAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalBalance = income - expenses;

    const previousStartDate = new Date(startDate);
    if (view === "week") {
      previousStartDate.setDate(startDate.getDate() - 7);
    } else if (view === "month") {
      previousStartDate.setMonth(startDate.getMonth() - 1);
    } else {
      previousStartDate.setFullYear(startDate.getFullYear() - 1);
    }

    const previousTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.loggedAt);
      return transactionDate >= previousStartDate && transactionDate < startDate;
    });

    const previousIncome = previousTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const previousExpenses = previousTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const previousBalance = previousIncome - previousExpenses;
    const balanceChange = totalBalance - previousBalance;

    const totalSwipes = mealSwipe?.swipesTotal || 0;
    const usedSwipes = mealSwipe?.swipesUsed || 0;
    const remainingSwipes = totalSwipes - usedSwipes;
    const diningDollars = mealSwipe?.diningDollars || 0;

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingPayments = subscriptions
    .filter((sub) => {
      const nextPayment = getNextPaymentDate(sub.firstPaymentDate, sub.billingCycle);
      return nextPayment <= nextWeek && nextPayment >= new Date();
    })
    .reduce((sum, sub) => sum + Number(sub.amount), 0);


    const categoryMap = new Map<string, number>();
    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + Number(t.amount));
      });

      const categories = Array.from(categoryMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        color: getCategoryColor(name || "Other"),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

      const incomeMap = new Map<string, number>();
    filteredTransactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        const current = incomeMap.get(t.category) || 0;
        incomeMap.set(t.category, current + Number(t.amount));
      });

    const incomeCategories = Array.from(incomeMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        color: getCategoryColor(name || "Other"),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

      const budgets = await prisma.budget.findMany({
        where: { userID },
      });
      
      const budgetMap = budgets.map((b) => {
        const spent = categoryMap.get(b.category) || 0;
        return {
          category: b.category,
          limit: b.limitAmount,
          spent,
          period: b.period
        };
      });      

    const recentTransactions = filteredTransactions
      .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime())
      .slice(0, 10)
      .map((t) => ({
        date: t.loggedAt,
        description: `${t.type} - ${t.category}`,
        category: t.category,
        amount: Number(t.amount),
        type: t.type,
      }));

    const upcomingSubscriptions = subscriptions
      .map((sub) => ({
        name: sub.name,
        nextPayment: getNextPaymentDate(sub.firstPaymentDate, sub.billingCycle),
        amount: Number(sub.amount),
        frequency: sub.billingCycle,
        description: sub.description,
      }))
      .filter((sub) => sub.nextPayment >= new Date())
      .sort((a, b) => a.nextPayment.getTime() - b.nextPayment.getTime())
      .slice(0, 5);

    const dashboardData = {
      summary: {
        totalBalance,
        balanceChange,
        remainingSwipes,
        totalSwipes,
        diningDollars,
        upcomingPayments,
      },
      charts: {
        income,
        expenses,
        categories,
        incomeCategories,
        totalIncome: income,
        totalExpenses: expenses,
        budgets: budgetMap
      },
      recentTransactions,
      upcomingSubscriptions,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

const getNextPaymentDate = (firstPayment: Date, billingCycle: string): Date => {
  const now = new Date();
  const first = new Date(firstPayment);
  
  if (first > now) return first;
  
  let next = new Date(first);
  
  switch (billingCycle.toLowerCase()) {
    case "weekly":
      while (next <= now) {
        next.setDate(next.getDate() + 7);
      }
      break;
    case "monthly":
      while (next <= now) {
        next.setMonth(next.getMonth() + 1);
      }
      break;
    case "yearly":
      while (next <= now) {
        next.setFullYear(next.getFullYear() + 1);
      }
      break;
    default:
      while (next <= now) {
        next.setMonth(next.getMonth() + 1);
      }
  }
  
  return next;
};

const getCategoryColor = (() => {
  const palette = [
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#e91e63",
    "#9c27b0",
    "#00bcd4",
    "#ffc107",
    "#8bc34a",
    "#f44336",
    "#009688",
  ];

  const map = new Map<string, string>();
  let index = 0;

  return (categoryInput?: string): string => {
    const category: string = categoryInput ?? "Other";
    if (!map.has(category)) {
      map.set(category, palette[index % palette.length] as string);
      index++;
    }
    return map.get(category)!;
  };
})();

