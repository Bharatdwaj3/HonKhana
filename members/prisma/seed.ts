import bcrypt from 'bcryptjs';
import prisma from '../src/config/prisma-client.ts';

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@library.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { email: ADMIN_EMAIL, username: ADMIN_USERNAME, password: hashedPassword, role: 'admin' },
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