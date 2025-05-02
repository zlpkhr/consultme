import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export type ChatEntry = {
  id: string;
  name: string;
  avatar: string;
  message: string;
  createdAt: Date;
};

export const projects = pgTable("projects", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  emoji: varchar({ length: 1 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  stage: text("stage").notNull(),
  productDescription: text("product_description"),
  refinedProductDescription: text("refined_product_description"),
  targetAudience: jsonb("target_audience"),
  report: text("report"),
  chat: jsonb("chat").$type<ChatEntry[]>(),
});

export type Project = typeof projects.$inferSelect;
