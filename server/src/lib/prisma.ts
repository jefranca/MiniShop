import path from 'node:path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const databasePath = path.resolve('prisma', 'dev.db');
const adapter = new PrismaBetterSqlite3({
  url: `file:${databasePath}`,
});

export const prisma = new PrismaClient({ adapter });
