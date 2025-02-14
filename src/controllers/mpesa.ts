import express from "express";
import { prisma } from "../util/connection";
import axios from "axios";
import moment from "moment";


export default async function payMpesa(req: express.Request, res: express.Response) {
  if (req.method !== "POST") {
     res.status(405).json({ error: "Method not allowed" });
     return;
  }

  try {
    const { userId, phoneNumber, amount, bookingServiceId } = req.body;

    if (!userId || !phoneNumber || !amount ) {
       res.status(400).json({ error: "Missing required fields" });
       return;
    }

    // Get access token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
    const { data: tokenResponse } = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
    });
    const accessToken = (tokenResponse as { access_token: string }).access_token;

    // Generate timestamp
    const timestamp = moment().format("YYYYMMDDHHmmss");

    // Generate password
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    

    interface StkPushResponse {
        CheckoutRequestID: string;
        // Add other properties that the response may contain
      }

    const stkPushResponse = await axios.post<StkPushResponse>(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: process.env.MPESA_SHORTCODE, // Recipient (Business)
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phoneNumber, // Payer (User's phone number)
          PartyB: process.env.MPESA_SHORTCODE, // Recipient (Your Paybill/Till Number)
          PhoneNumber: phoneNumber,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: `Booking-${bookingServiceId}`,
          TransactionDesc: "Payment for service",
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      
    // Store payment request in database
    const payment = await prisma.payment.create({
      data: {
        userId,
        bookingServiceId,
        amount,
        paymentMethod: "M-Pesa",
        paymentStatus: "completed",
        paymentDate: new Date(),
        transactionId: stkPushResponse.data.CheckoutRequestID, // Store STK push request ID
      },
    });

     res.status(200).json({ success: true, payment });
     return;
  } catch (error) {
    console.error("M-Pesa payment error:", error);
     res.status(500).json({ error: "Internal server error" });
     return;
  }
}


export async function mpesaWebhook(req: express.Request, res: express.Response) {
  console.log("Headers:", req.headers);
  console.log("Raw Body:", req.body);

  if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
  }

  try {
      if (!req.body || !req.body.Body) {
          console.error("Invalid Request Body:", req.body);
          res.status(400).json({ error: "Invalid request payload" });
          return;
      }

      const { Body } = req.body;
      if (!Body.stkCallback) {
          res.status(400).json({ error: "Missing stkCallback" });
          return;
      }

      const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

      if (ResultCode !== 0) {
          console.error(`Payment failed: ${ResultDesc}`);
          res.status(200).json({ message: "Payment failed", ResultDesc });
          return;
      }

      const amount = CallbackMetadata.Item.find((item: any) => item.Name === "Amount")?.Value;
      const mpesaReceiptNumber = CallbackMetadata.Item.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;
      const transactionDate = CallbackMetadata.Item.find((item: any) => item.Name === "TransactionDate")?.Value;
      const phoneNumber = CallbackMetadata.Item.find((item: any) => item.Name === "PhoneNumber")?.Value;

      console.log("Extracted Payment Data:", { amount, mpesaReceiptNumber, transactionDate, phoneNumber });

      res.status(200).json({ success: true });
  } catch (error) {
      console.error("M-Pesa Webhook error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
}
