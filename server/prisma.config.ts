import path from 'node:path';
import { defineConfig } from 'prisma/config';

const databasePath = path.resolve('prisma', 'dev.db').replace(/\\/g, '/');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: `file:${databasePath}`,
  },
});
