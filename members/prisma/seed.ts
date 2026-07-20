import bcrypt from 'bcryptjs';
import prisma from '../config/prisma-client.ts';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/env.config.ts';

const ADMIN_USERNAME = 'admin';

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log(`Admin ready: ${admin.email} (username: ${admin.username})`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
