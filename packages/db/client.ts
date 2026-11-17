import 'dotenv/config'; 
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}
console.log("Prisma config - DATABASE_URL:", process.env.DATABASE_URL)

export function createClient() {
  if (!global.prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    const adapter = new PrismaPg({ connectionString: connectionString });
    global.prisma = new PrismaClient({ adapter });
  }
  return global.prisma;
}