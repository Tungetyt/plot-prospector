/*
  Warnings:

  - You are about to drop the `Car` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('PLN', 'EUR', 'USD', 'GBP', 'Other');

-- DropTable
DROP TABLE "Car";

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "price" DOUBLE PRECISION,
    "priceCurrency" "Currency" NOT NULL DEFAULT 'USD',
    "transactionType" TEXT[],
    "tel" TEXT,
    "email" TEXT,
    "pictures" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Point" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
