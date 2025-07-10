import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import type { Client } from "@libsql/client";
// UTILS
import { env } from "@/env";
// SCHEMAS
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client =
  globalForDb.client ??
  createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
