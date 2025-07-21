-- CreateTable
CREATE TABLE "JuegoRaspaGanaIntento" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "juegoId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JuegoRaspaGanaIntento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JuegoRaspaGanaIntento_usuarioId_juegoId_key" ON "JuegoRaspaGanaIntento"("usuarioId", "juegoId");

-- AddForeignKey
ALTER TABLE "JuegoRaspaGanaIntento" ADD CONSTRAINT "JuegoRaspaGanaIntento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JuegoRaspaGanaIntento" ADD CONSTRAINT "JuegoRaspaGanaIntento_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "JuegoRaspaGanaDiario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
