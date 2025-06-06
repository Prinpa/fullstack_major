import { test as setup, expect } from '@playwright/test';
import { createClient } from '@repo/db/client';
import jwt from 'jsonwebtoken';
import { env } from './test-env';

const prisma = createClient();

setup('authenticate as admin', async ({ request, context }) => {
  // First create a test user if it doesn't exist
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: 'hashedPassword', // In real app, hash this
      firstName: 'Test',
      lastName: 'User',
      role: 'admin'
    }
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: testUser.id, role: testUser.role },
    env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  console.log('Generated token:', token);

  // Add the token as an HTTP only cookie
  await context.addCookies([{
    name: 'token',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  }]);

  // Save authentication state
  await context.storageState({ path: '.auth/admin.json' });
});
