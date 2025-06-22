import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date().toISOString();

  const { count } = await prisma.posts.deleteMany({
    where: {
      expiresAt: {
        lt: now, // delete if expired
      },
    },
  });
  console.log(`🧹 Deleted ${count} expired posts as of ${now}`);
  await prisma.$disconnect();

  console.log(`🧹 Deleted ${count} expired posts as of ${now}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Error deleting expired posts:", e);
  process.exit(1);
});
