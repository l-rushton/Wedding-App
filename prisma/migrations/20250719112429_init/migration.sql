-- CreateEnum
CREATE TYPE "Appetiser" AS ENUM ('mushrooms', 'fishcakes');

-- CreateEnum
CREATE TYPE "MainCourse" AS ENUM ('green', 'massaman');

-- CreateEnum
CREATE TYPE "Dessert" AS ENUM ('lemonTart', 'chocolateMousse');

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rsvp" BOOLEAN,
    "dietaryReqs" TEXT,
    "addressId" TEXT,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "appetiser" "Appetiser",
    "main" "MainCourse",
    "dessert" "Dessert",
    "guestId" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistryPurchase" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemUrl" TEXT NOT NULL,
    "itemImageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "purchaserName" TEXT,
    "purchaserMessage" TEXT,
    "purchasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistryPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_guestId_key" ON "Menu"("guestId");

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
