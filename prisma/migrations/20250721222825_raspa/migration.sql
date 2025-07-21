-- AlterTable
ALTER TABLE "CuponDescuento" ADD COLUMN     "usuarioId" TEXT;

-- CreateTable
CREATE TABLE "JuegoRaspaGanaDiario" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "numerosGanadores" INTEGER[],
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ganadorId" TEXT,

    CONSTRAINT "JuegoRaspaGanaDiario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JuegoRaspaGanaDiario_fecha_key" ON "JuegoRaspaGanaDiario"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "JuegoRaspaGanaDiario_ganadorId_key" ON "JuegoRaspaGanaDiario"("ganadorId");

-- AddForeignKey
ALTER TABLE "CuponDescuento" ADD CONSTRAINT "CuponDescuento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JuegoRaspaGanaDiario" ADD CONSTRAINT "JuegoRaspaGanaDiario_ganadorId_fkey" FOREIGN KEY ("ganadorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
