/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookingServiceId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `year` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "appointmentId",
ADD COLUMN     "bookingServiceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Appointment";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingServiceId_fkey" FOREIGN KEY ("bookingServiceId") REFERENCES "BookingService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
