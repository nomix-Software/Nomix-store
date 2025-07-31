-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_productoId_idx" ON "Review"("productoId");

-- CreateIndex
CREATE INDEX "Review_usuarioId_idx" ON "Review"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_productoId_usuarioId_key" ON "Review"("productoId", "usuarioId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
