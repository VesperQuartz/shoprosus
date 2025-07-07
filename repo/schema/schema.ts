import { int, numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";

export const cartTable = sqliteTable("carts", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  quantity: int().notNull(),
  price: numeric({ mode: "number" }).notNull(),
  image: text().default("/no_image.png"),
  userId: text().references(() => user.id),
});

export type CartTableInsert = typeof cartTable.$inferInsert;
export type CartTableSelect = typeof cartTable.$inferSelect;
