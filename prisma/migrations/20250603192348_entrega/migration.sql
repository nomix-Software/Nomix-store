-- DropForeignKey
ALTER TABLE "Entrega" DROP CONSTRAINT "Entrega_ventaId_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Entrega" ALTER COLUMN "ventaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "nombreCliente" TEXT,
ADD COLUMN     "telefonoCliente" TEXT,
ALTER COLUMN "usuarioId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "VentaProvisoria" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "descripcion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VentaProvisoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
