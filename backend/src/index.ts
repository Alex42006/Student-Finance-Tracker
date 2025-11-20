import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import mealSwipeRoutes from "./routes/mealSwipeRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"


dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/mealswipes", mealSwipeRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/dashboard", dashboardRoutes)


app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
