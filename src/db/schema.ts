import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  emoji: varchar({ length: 1 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  productDescription: text("product_description"),
  refinedProductDescription: text("refined_product_description"),
});

export type Project = typeof projects.$inferSelect;
