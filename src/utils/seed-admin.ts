import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ventaCorrectaId = 2;
  const ventaIncorrectaId = 3;

  console.log("Iniciando script de corrección de datos...");

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Encontrar la información de entrega de la venta incorrecta (ID 3)
      const entregaDeVenta3 = await tx.entrega.findFirst({
        where: { ventaId: ventaIncorrectaId },
      });

      if (!entregaDeVenta3) {
        throw new Error(
          `No se encontró información de entrega para la venta con ID ${ventaIncorrectaId}. Puede que el script ya se haya ejecutado.`
        );
      }
      console.log(
        `- Entrega (ID: ${entregaDeVenta3.id}) encontrada, asociada a la venta incorrecta ${ventaIncorrectaId}.`
      );

      // 2. Re-asociar esa entrega a la venta correcta (ID 2)
      await tx.entrega.update({
        where: { id: entregaDeVenta3.id },
        data: { ventaId: ventaCorrectaId },
      });
      console.log(
        `- Entrega re-asociada a la venta correcta (ID: ${ventaCorrectaId}).`
      );

      // 3. Eliminar la venta incorrecta (ID 3)
      // Se eliminan posibles productos asociados a la venta incorrecta para evitar errores.
      await tx.ventaProducto.deleteMany({
        where: { ventaId: ventaIncorrectaId },
      });

      await tx.venta.delete({
        where: { id: ventaIncorrectaId },
      });
      console.log(`- Venta incorrecta (ID: ${ventaIncorrectaId}) eliminada.`);
    });

    console.log("✅ Transacción completada con éxito.");
  } catch (error) {
    console.error("🔴 ERROR: La transacción falló y se revirtieron los cambios.");
    console.error(error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
