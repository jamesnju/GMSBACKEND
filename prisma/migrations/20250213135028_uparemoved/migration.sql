/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "phoneNumber",
DROP COLUMN "recipientId";
