import {desc, eq} from "drizzle-orm"
import {db} from "@/lib/server/db/client";
import {groceryItems, users} from "@/lib/server/db/schema";
import {User} from "@/store/grocery-store";

type login = {
    id:string,
    email:string,
    password:string
}

export const createUser = async (input: { email: string; password: string }): Promise<User | null> => {
    const rows = await db.insert(users).values({
        id: crypto.randomUUID(),
        email: input.email,
        password: input.password,
    }).returning();
    return rows[0] ?? null;
}

export const getUserById = async (id: string): Promise<User | null> => {
    const user = await db.query.users.findFirst({
        where: (users, {eq}) => eq(users.id, id),
        columns: {
            id: true,
            email: true,
        }
    });
    return user || null;
};

export const getUserByEmail = async (email: string): Promise<login | null> => {
    const user = await db.query.users.findFirst({
        where: (users, {eq}) => eq(users.email, email),
        columns: {
            id: true,
            email: true,
            password: true
        }
    });
    return user || null;
};

export const getGroceryItems = async () => {
    return db.select().from(groceryItems).orderBy(desc(groceryItems.updated_at));
}

export const createGroceryItem = async (input: {
    name: string,
    category: string,
    quantity: number,
    priority: string,
    userId: string
}) => {
    const rows = await db.insert(groceryItems).values({
        id: crypto.randomUUID(),
        name: input.name,
        category: input.category,
        quantity: Math.max(1, input.quantity),
        priority: input.priority,
        purchased: false,
        userId: input.userId,
        updated_at: Date.now(),
    }).returning();
    return rows[0];
}

export const setGroceryItemPurchased = async (id: string, purchased: boolean) => {
    const rows = await db.update(groceryItems)
        .set({purchased, updated_at: Date.now()})
        .where(eq(groceryItems.id, id))
        .returning();
    if (!rows.length) return null;
    return rows[0];
}
export const updateGroceryItemQuantity = async (id: string, quantity: number) => {
    const rows = await db
        .update(groceryItems)
        .set({quantity: Math.max(1, Math.floor(quantity)), updated_at: Date.now()})
        .where(eq(groceryItems.id, id))
        .returning();

    if (!rows.length) return null;
    return rows[0];
};

export const deleteGroceryItem = async (id: string) => {
    await db.delete(groceryItems).where(eq(groceryItems.id, id));
};

export const clearPurchasedItems = async () => {
    await db.delete(groceryItems).where(eq(groceryItems.purchased, true));
};