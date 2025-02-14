/*
  Warnings:

  - Added the required column `phoneNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "merchantRequestId" TEXT,
ADD COLUMN     "mpesaReceipt" TEXT,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT,
ALTER COLUMN "paymentMethod" SET DEFAULT 'MPESA';
