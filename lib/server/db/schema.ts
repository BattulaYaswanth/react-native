import { bigint, boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; // Imported for defining relationships

// 1. Users Table
export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
});

// 2. Grocery Items Table (with Foreign Key)
export const groceryItems = pgTable("grocery_items", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    quantity: integer("quantity").notNull().default(1),
    purchased: boolean("purchased").notNull().default(false),
    priority: text("priority").notNull().default("medium"),
    updated_at: bigint("updated_at", { mode: "number" }).notNull(),

    // Establishing the Foreign Key Reference
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});

// 3. Optional but highly recommended: Drizzle Application-Level Relations
// This enables easier relational querying (e.g., db.query.users.findMany({ with: { groceryItems: true } }))
export const usersRelations = relations(users, ({ many }) => ({
    groceryItems: many(groceryItems),
}));

export const groceryItemsRelations = relations(groceryItems, ({ one }) => ({
    user: one(users, {
        fields: [groceryItems.userId],
        references: [users.id],
    }),
}));

