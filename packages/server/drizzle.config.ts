import type { Config } from "drizzle-kit";

const host = process.env.POSTGRES_HOST as string;
const port = 5432;
const database = process.env.POSTGRES_DB as string;
const user = process.env.POSTGRES_USER as string;
const password = process.env.POSTGRES_PASSWORD as string;

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgresql://${user}:${password}@${host}:${port}/${database}`,
  },
  strict: true,
} satisfies Config;