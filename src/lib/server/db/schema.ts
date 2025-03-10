import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// User and Session
export const user = sqliteTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    githubId: integer('github_id').unique(),
    githubAvatarUrl: text('github_avatar_url'),
    passwordHash: text('password_hash')
});

export const session = sqliteTable("session", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Extension
export const extension = sqliteTable("extension", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().references(() => user.id),
    title: text('title').notNull(),
    description: text('description').notNull(),
    // icon_url: text('icon_url').notNull(),
    // category: text('category').notNull(),
    version: text('version').notNull(),
    created_at: integer({ mode: "timestamp" }).notNull()
        .default(sql`(unixepoch())`),
    updated_at: integer({ mode: "timestamp" }).notNull()
        .default(sql`(unixepoch())`)
        .$onUpdate(() => new Date()),
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Extension = typeof extension.$inferSelect;

