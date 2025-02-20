import express from "express";
import { prisma } from "../util/connection";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});


export const createPayment = async (
  req: express.Request,
  res: express.Response
) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const { userId, bookingServiceId, amount, paymentMethodId } = req.body;

    if (!userId || !bookingServiceId || !amount || !paymentMethodId) {
      res.status(400).json({ error: "Invalid request. Missing required fields." });
      return;
    }

    // Check user existence
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check booking service existence
    const bookingService = await prisma.bookingService.findUnique({ where: { id: bookingServiceId } });
    if (!bookingService) {
      res.status(404).json({ error: "Booking Service not found" });
      return;
    }

    // Create a Stripe Payment Intent using the payment method ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true, // Enable automatic methods
        allow_redirects: "never", // Prevent redirect-based payments
      },
      metadata: { userId, bookingServiceId },
    });

    // Store the payment record in the database
    const payment = await prisma.payment.create({
      data: {
        userId,
        bookingServiceId,
        amount,
        paymentMethod: "card",
        paymentStatus: "pending..", // Initially "pending", updated via webhook
        paymentDate: new Date(),
      },
    });

    res.status(200).json({
      message: "Payment initiated",
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      payment,
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
    return;
  }
};




  //get payments
  export const getAllPayments = async (req: express.Request, res: express.Response) => {
    if (req.method === "GET") {
      try {
        const payments = await prisma.payment.findMany();
        res.status(200).json({ payments });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
      return;
    }
  }