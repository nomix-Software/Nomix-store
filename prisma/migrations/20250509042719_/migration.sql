-- CreateEnum
CREATE TYPE "TipoEntrega" AS ENUM ('RETIRO', 'ENVIO');

-- CreateTable
CREATE TABLE "Entrega" (
    "id" SERIAL NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "tipo" "TipoEntrega" NOT NULL,
    "puntoRetiro" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "provincia" TEXT,
    "codigoPostal" TEXT,
    "pais" TEXT,
    "contacto" TEXT,
    "telefono" TEXT,
    "observaciones" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_ventaId_key" ON "Entrega"("ventaId");

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
