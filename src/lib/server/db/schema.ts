import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// User and Session
export const user = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true}),
  username: text("username").notNull().unique(),
  githubId: integer("github_id").unique(),
  githubToken: text("github_token"),
  githubAvatarUrl: text("github_avatar_url"),
  passwordHash: text("password_hash")
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull()
});

// Extension
export const extension = sqliteTable("extension", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  githubId: integer("github_id").unique(),
  userId: integer("user_id").notNull().references(() => user.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon_url: text("icon_url").notNull(),
  zipball_url: text("zipball_url").notNull(),
  categoryId: integer("category_id").notNull().references(() => category.id),
  version: text("version").notNull(),
  created_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer({ mode: "timestamp" }).notNull()
    .default(sql`(unixepoch())`)
});

export const category = sqliteTable("category", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  nameJP: text("name-jp").notNull().unique(),
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Extension = typeof extension.$inferSelect;
export type Category = typeof category.$inferSelect;

