import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

const main = async () => {
  console.log("Iniciando seed...");

  await prisma.user.deleteMany();

  const [admin, lawyer1, lawyer2] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Arthur Admin",
        username: "arthur",
        passwordHash: await bcrypt.hash("admin123", 12),
        admin: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana Carvalho",
        username: "ana.carvalho",
        passwordHash: await bcrypt.hash("senha123", 12),
        admin: false,
      },
    }),
    prisma.user.create({
      data: {
        name: "Carlos Mendes",
        username: "carlos.mendes",
        passwordHash: await bcrypt.hash("senha123", 12),
        admin: false,
      },
    }),
  ]);

  console.log("Usuários criados:");
  console.log(`  Admin:     ${admin.username} (${admin.name})`);
  console.log(`  Advogado:  ${lawyer1.username} (${lawyer1.name})`);
  console.log(`  Advogado:  ${lawyer2.username} (${lawyer2.name})`);
  console.log("Seed concluído.");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
