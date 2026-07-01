import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

const main = async () => {
  const username = process.env.SEED_ADMIN_USERNAME;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "SEED_ADMIN_USERNAME e SEED_ADMIN_PASSWORD devem estar definidos no .env",
    );
  }

  console.log("Iniciando seed...");

  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: username,
      username,
      passwordHash: await bcrypt.hash(password, 12),
      admin: true,
    },
  });

  console.log(`Usuário criado: ${admin.username}`);
  console.log("Seed concluído.");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
