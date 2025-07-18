import { relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import type { AdapterAccount } from "next-auth/adapters";
import { index, primaryKey, sqliteTableCreator } from "drizzle-orm/sqlite-core";
// TYPES
import type { AuditLogActions, ListingStatusType } from "@/lib/types";

export const createTable = sqliteTableCreator(
  (name) => `car-rental-dashboard_${name}`,
);

export const listing = createTable("listing", (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  carName: d.text({ length: 255 }).notNull(),
  description: d.text({ length: 255 }).notNull(),
  owner: d.text({ length: 255 }).notNull(),
  status: d
    .text({ length: 32 })
    .$type<ListingStatusType>()
    .default("pending")
    .notNull(),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: d.integer({ mode: "timestamp" }),
}));

export const listingRelations = relations(listing, ({ many }) => ({
  auditLogs: many(auditLog),
}));

export const auditLog = createTable("audit_log", (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  action: d.text({ length: 255 }).notNull().$type<AuditLogActions>(),
  adminId: d
    .text({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  listingId: d
    .text({ length: 255 })
    .notNull()
    .references(() => listing.id, { onDelete: "cascade" }),
  createdAt: d
    .integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  listing: one(listing, {
    fields: [auditLog.listingId],
    references: [listing.id],
  }),
  admin: one(users, { fields: [auditLog.adminId], references: [users.id] }),
}));

export const users = createTable("user", (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: d.text({ length: 255 }),
  email: d.text({ length: 255 }).notNull(),
  password: d.text({ length: 255 }).notNull(),
  emailVerified: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
  image: d.text({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.text({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.text({ length: 255 }).notNull(),
    providerAccountId: d.text({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.text({ length: 255 }),
    scope: d.text({ length: 255 }),
    id_token: d.text(),
    session_state: d.text({ length: 255 }),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
    }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.text({ length: 255 }).notNull().primaryKey(),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.text({ length: 255 }).notNull(),
    token: d.text({ length: 255 }).notNull(),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
