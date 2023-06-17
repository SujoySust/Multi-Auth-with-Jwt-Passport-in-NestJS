import { PrismaClient } from '@prisma/client';
import { seedStaffs } from './seeds/staff.seeder';

const prisma = new PrismaClient({ log: ['query'] });
//pass prisma from here to log or empty

async function main() {
  await seedStaffs(prisma);
  //
}

main()
  .catch((e) => {
    console.error(e.stack);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
