import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import WebSocket from 'ws';

// Configure Neon for serverless environments
neonConfig.webSocketConstructor = WebSocket;

declare global {
  var prisma: PrismaClient | undefined;
}

export function createClient() {
  if (!global.prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    global.prisma = new PrismaClient();
  }
  return global.prisma;
}