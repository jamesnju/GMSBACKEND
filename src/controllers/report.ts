import express from "express";
import { prisma } from "../util/connection";

export async function systemReport(req: express.Request, res: express.Response) {
    try {
        const users = await prisma.user.findMany({
            select: {
                //id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                //vehicles: true,
                //bookings: true,
                //payments: true,
                //reviews: true,
                //adminLogs: true,
            }
        });

        const services = await prisma.service.findMany({
            include: {
                category: true,
                bookings: true,
                reviews: true,
            }
        });

        const serviceCategories = await prisma.serviceCategory.findMany({
            include: {
                services: true,
                bookings: true,
            }
        });

        const bookingServices = await prisma.bookingService.findMany({
            include: {
                user: true,
                service: true,
                category: true,
                Payment: true,
            }
        });

        const payments = await prisma.payment.findMany({
            include: {
                user: true,
                bookingService: true,
                transactions: true,
            }
        });

        const vehicles = await prisma.vehicle.findMany({
            include: {
                owner: true,
            }
        });

        const reviews = await prisma.review.findMany({
            include: {
                user: true,
                service: true,
            }
        });

        const paymentTransactions = await prisma.paymentTransaction.findMany({
            include: {
                payment: true,
            }
        });

        const report = {
            users,
            services,
            serviceCategories,
            bookingServices,
            payments,
            vehicles,
            reviews,
            paymentTransactions,
        };

        res.json(report);
        return;
    } catch (error) {
        console.error("Error generating system report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}