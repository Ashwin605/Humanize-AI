import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let dbUrl = process.env.DATABASE_URL;

// VERCEL WORKAROUND: Serverless functions have a read-only filesystem except for /tmp.
// We must copy the SQLite database to /tmp so Prisma can write to it.
if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db';
  const bundleDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  
  try {
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(bundleDbPath)) {
      fs.copyFileSync(bundleDbPath, tmpDbPath);
    }
    dbUrl = 'file:/tmp/dev.db';
  } catch (e) {
    console.error('Failed to copy database to /tmp', e);
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
