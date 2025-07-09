/*
  Warnings:

  - A unique constraint covering the columns `[preferenceId]` on the table `Carrito` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Carrito" ADD COLUMN     "preferenceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Carrito_preferenceId_key" ON "Carrito"("preferenceId");
