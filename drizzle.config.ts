import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  out: "drizzle/migrations",

  verbose: true,
  strict: true,
  dialect: 'sqlite'
  
});
