import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // LIMPIAR BASE DE DATOS (orden correcto)

  // Crear usuario
 await prisma.user.update({ 
    where:{ email : 'marcosgaliano96@gmail.com'}, data: { rol : 'ADMIN'}

  });

  
  console.log("Seed limpio y cargado con productos electrónicos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
