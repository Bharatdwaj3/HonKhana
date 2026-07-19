import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

const user = env('PgSql_User');
const pword = env('PgSql_Password');
const db = env('PgSql_Database');
const host = process.env.PgSql_Host || 'members-db';
const port = process.env.PgSql_Port || '5432';
const EPword = encodeURIComponent(pword);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: `postgresql://${user}:${EPword}@${host}:${port}/${db}?schema=public`,
  },
});
