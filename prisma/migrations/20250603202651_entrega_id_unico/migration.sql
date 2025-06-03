/*
  Warnings:

  - You are about to drop the column `descripcion` on the `Venta` table. All the data in the column will be lost.
  - You are about to drop the `VentaProvisoria` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[carritoId]` on the table `Entrega` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Venta" DROP COLUMN "descripcion",
ADD COLUMN     "observacion" TEXT;

-- DropTable
DROP TABLE "VentaProvisoria";

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_carritoId_key" ON "Entrega"("carritoId");
