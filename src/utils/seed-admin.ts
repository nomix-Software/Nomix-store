import { PrismaClient } from "@prisma/client";
import { sendCouponWonEmail } from "../actions/sendEmail/sendCouponWonEmail";

const prisma = new PrismaClient();

async function main() {
  const usuario = await prisma.user.delete({
    where: { email: "cliente1@cliente.com" },

  });
  const usuarios = await prisma.user.findMany()
  console.log("Usuario actualizado a ADMIN", { usuarios, usuario });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
