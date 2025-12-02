import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import mealSwipeRoutes from "./routes/mealSwipeRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"
import financialAidRoutes from "./routes/financialAidRoutes";
import budgetsRoutes from "./routes/budgetRoutes";
import diningExpensesRoutes from "./routes/diningExpensesRoutes";
import profileRoutes from "./routes/profileRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/transactions", diningExpensesRoutes);
app.use("/mealswipes", mealSwipeRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/dashboard", dashboardRoutes)
app.use("/financialAid", financialAidRoutes);
app.use("/budgets", budgetsRoutes);
app.use("/profile", profileRoutes);


app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
