/*
  Warnings:

  - You are about to drop the column `appointmentDate` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[licensePlate]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookedDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "appointmentDate",
ADD COLUMN     "bookedDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "year" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");
