import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const guestMessages = mysqlTable("guest_messages", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  authorName: varchar("authorName", { length: 160 }).notNull(),
  place: mysqlEnum("place", ["general", "hong-kong", "tianjin", "california"]).default("general").notNull(),
  guestNote: varchar("guestNote", { length: 280 }).notNull(),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GuestMessage = typeof guestMessages.$inferSelect;
export type InsertGuestMessage = typeof guestMessages.$inferInsert;
