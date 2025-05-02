import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config(); 
const prisma = new PrismaClient();

async function main() {
  const name = process.env.DEFAULT_USER_NAME;
  const email = process.env.DEFAULT_USER_EMAIL;
  const password = process.env.DEFAULT_USER_PASSWORD;

  if (!name || !email || !password) {
    throw new Error('Missing environment variables for default user');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('Default user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  console.log('✅ Default user created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());