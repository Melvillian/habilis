import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/** -------------- Database Client Pool setup -------------- */
// import this file as `import { db } from src/db/` whenever you need a database connection.
// Drizzle will read the drizzle.config.ts config to deteremine schemas and other configuration params

const host = process.env.POSTGRES_HOST as string;
const port = 5432;
const database = process.env.POSTGRES_DB as string;
const user = process.env.POSTGRES_USER as string;
const password = process.env.POSTGRES_PASSWORD as string;

const db: NodePgDatabase | null = null;

export const getDatabase = (): NodePgDatabase => {
  if (!db) {
    const pool = new Pool({
      connectionString: `postgresql://${user}:${password}@${host}:${port}/${database}`,
    });
    
    console.log(`⛁ Database connection established with connection string postgresql://${user}:********@${host}:${port}/${database}`);
    
    return drizzle(pool);
  }

  return db;
}
