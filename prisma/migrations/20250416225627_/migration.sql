/*
  Warnings:

  - Added the required column `publicId` to the `ImagenProducto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImagenProducto" ADD COLUMN     "publicId" TEXT NOT NULL;
