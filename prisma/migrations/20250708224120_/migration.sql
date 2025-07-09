-- AlterTable
ALTER TABLE "Carrito" ADD COLUMN     "cuponId" INTEGER;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_cuponId_fkey" FOREIGN KEY ("cuponId") REFERENCES "CuponDescuento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
