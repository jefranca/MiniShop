import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const databasePath = path.resolve(currentDirectory, '..', '..', 'prisma', 'dev.db');
const adapter = new PrismaBetterSqlite3({
  url: `file:${databasePath}`,
});

export const prisma = new PrismaClient({ adapter });
