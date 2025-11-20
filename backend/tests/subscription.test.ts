import request from "supertest";
import express from "express";
import router from "../src/routes/subscriptionRoutes";
import prisma from "../src/prisma/client";

jest.mock("../src/prisma/client", () => ({
  subscription: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/subscriptions", router);

describe("Subscription Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /subscriptions/addSubscription", () => {
    it("Add subscription", async () => {
      const mockSub = {
        id: 1,
        userID: 1,
        name: "Netflix",
        amount: 12.99,
        billingCycle: "monthly",
        firstPaymentDate: new Date(),
      };

      (prisma.subscription.create as jest.Mock).mockResolvedValue(mockSub);

      const res = await request(app)
        .post("/subscriptions/addSubscription")
        .send({
          userID: 1,
          name: "Netflix",
          amount: 12.99,
          billingCycle: "monthly",
          firstPaymentDate: new Date(),
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Subscription added successfully");
      expect(res.body.subscription).toEqual(mockSub);
      expect(prisma.subscription.create).toHaveBeenCalledTimes(1);
    });

    it("Fail to add subscription", async () => {
      const res = await request(app)
        .post("/subscriptions/addSubscription")
        .send({ name: "" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("All fields are required");
    });
  });

  describe("GET /subscriptions/getSubscriptionsByUser/:userID", () => {
    it("should return subscriptions for a user", async () => {
      const mockSubs = [
        { id: 1, userID: 1, name: "Netflix" },
        { id: 2, userID: 1, name: "Spotify" },
      ];

      (prisma.subscription.findMany as jest.Mock).mockResolvedValue(mockSubs);

      const res = await request(app).get("/subscriptions/getSubscriptionsByUser/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockSubs);
    });
  });

  describe("PUT /subscriptions/updateSubscription/:id", () => {
    it("should update a subscription successfully", async () => {
      const mockUpdated = {
        id: 1,
        userID: 1,
        name: "Updated Netflix",
        amount: 12,
        billingCycle: "monthly",
        firstPaymentDate: new Date(),
      };

      (prisma.subscription.update as jest.Mock).mockResolvedValue(mockUpdated);

      const res = await request(app)
        .put("/subscriptions/updateSubscription/1")
        .send({
          name: "Updated Netflix",
          amount: 12,
          billingCycle: "monthly",
          firstPaymentDate: new Date(),
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Subscription updated successfully");
      expect(res.body.subscription).toEqual(mockUpdated);
    });
  });

  describe("DELETE /subscriptions/deleteSubscription/:id", () => {
    it("Delete subscription", async () => {
      (prisma.subscription.delete as jest.Mock).mockResolvedValue({});

      const res = await request(app).delete("/subscriptions/deleteSubscription/1");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Subscription deleted successfully");
      expect(prisma.subscription.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
