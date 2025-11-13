import { Request, Response } from "express";
import prisma from "../prisma/client";

export const addSubscription = async (req: Request, res: Response) => {
  const { userID, name, amount, billingCycle, description, firstPaymentDate } = req.body;

  if (!userID || !name || !amount || !billingCycle || !firstPaymentDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const subscription = await prisma.subscription.create({
      data: { userID, name, amount, billingCycle, firstPaymentDate: new Date(firstPaymentDate), ...(description && { description })},
    });

    res.status(201).json({
      message: "Subscription added successfully",
      subscription,
    });
  } catch (error) {
    console.error("Error adding subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubscriptionsByUser = async (req: Request, res: Response) => {
    const { userID } = req.params;
  
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: { userID: Number(userID) },
        orderBy: { id: "asc" },
      });
  
      res.status(200).json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const updateSubscription = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, amount, billingCycle, description, firstPaymentDate } = req.body;
  
    try {
      const subscription = await prisma.subscription.update({
        where: { id: Number(id) },
        data: {
          ...(name && { name }),
          ...(amount && { amount }),
          ...(billingCycle && { billingCycle }),
          ...(firstPaymentDate && { firstPaymentDate: new Date(firstPaymentDate) }),
          ...(description !== undefined && { description }),
        },
      });
  
      res.status(200).json({
        message: "Subscription updated successfully",
        subscription,
      });
    } catch (error: any) {
      console.error("Error updating subscription:", error);
  
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const deleteSubscription = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      await prisma.subscription.delete({
        where: { id: Number(id) },
      });
  
      res.status(200).json({ message: "Subscription deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
  
      res.status(500).json({ error: "Internal server error" });
    }
  };