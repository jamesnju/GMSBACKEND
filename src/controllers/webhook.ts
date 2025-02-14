import express from "express";
import Stripe from "stripe";
import { prisma } from "../util/connection";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeWebhook = async (req: express.Request, res: express.Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("❌ Missing stripe-signature header");
     res.status(400).send("Webhook Error: Missing stripe-signature");
     return;
  }

  let event: Stripe.Event;
  try {
    // ✅ Verify the request using Stripe's constructEvent() method
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret!);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
     res.status(400).send(`Webhook Error: ${err.message}`);
     return;
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("✅ Payment received:", paymentIntent.id);

      if (!paymentIntent.metadata?.bookingServiceId || !paymentIntent.metadata?.userId) {
        console.error("❌ Missing metadata in paymentIntent");
         res.status(400).json({ error: "Missing metadata" });
         return;
      }

      const bookingServiceId = parseInt(paymentIntent.metadata.bookingServiceId, 10);
      const userId = parseInt(paymentIntent.metadata.userId, 10);

      // ✅ Update payment status in the database
      await prisma.payment.updateMany({
        where: { userId, bookingServiceId },
        data: { paymentStatus: "completed" },
      });

      console.log("✅ Payment status updated in DB");
    }

     res.status(200).json({ received: true });
     return;
  } catch (error: any) {
    console.error("❌ Webhook processing error:", error.message);
     res.status(500).json({ error: "Internal Server Error" });
     return;
  }
};
