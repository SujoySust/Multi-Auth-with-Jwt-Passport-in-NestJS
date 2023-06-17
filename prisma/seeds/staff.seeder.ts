import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { USER_STATUS } from '../../src/app/helpers/coreconstant';

export async function seedStaffs(prisma?: PrismaClient) {
  const prismaFromExternal = prisma;
  prisma = prisma ?? new PrismaClient();

  await prisma.staff.createMany({
    data: [
      {
        name: 'Mr Admin',
        email: 'admin@email.com',
        password: await hash('12345678', 10),
        created_at: new Date(),
        updated_at: new Date(),
        status: USER_STATUS.ACTIVE,
      },
    ],
    skipDuplicates: true,
  });

  if (!prismaFromExternal) await prisma.$disconnect();
}
