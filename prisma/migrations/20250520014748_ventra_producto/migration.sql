/*
  Warnings:

  - Added the required column `total` to the `VentaProducto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VentaProducto" ADD COLUMN     "descuento" DOUBLE PRECISION,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;
