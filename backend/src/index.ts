import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import mealSwipeRoutes from "./routes/mealSwipeRoutes";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/mealswipes", mealSwipeRoutes);


app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
