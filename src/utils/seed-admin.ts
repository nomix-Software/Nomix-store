import { PrismaClient } from "@prisma/client";
import { sendCouponWonEmail } from "../actions/sendEmail/sendCouponWonEmail";

const prisma = new PrismaClient();

async function main() {
  await sendCouponWonEmail("Marcosgaliano96@gmail.com", "CUPON123", 20);
  console.log("Correo de prueba enviado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
