const { neon } = require("@neondatabase/serverless");
const crypto = require("node:crypto");

const databaseUrl ="postgresql://neondb_owner:npg_uJM5TPVbg0YB@ep-late-butterfly-ao7wmohv-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

if (!databaseUrl) {
    throw new Error("DATABASE_URL is required. Example: DATABASE_URL=... npm run seed:grocery");
}

const sql = neon(databaseUrl);

const seedItems = [
    { name: "Bananas", category: "Produce", quantity: 6, priority: "medium", purchased: false },
    { name: "Avocado", category: "Produce", quantity: 3, priority: "high", purchased: false },
    { name: "Greek Yogurt", category: "Dairy", quantity: 2, priority: "medium", purchased: true },
    { name: "Cheddar Cheese", category: "Dairy", quantity: 1, priority: "low", purchased: false },
    { name: "Sourdough Bread", category: "Bakery", quantity: 1, priority: "high", purchased: false },
    { name: "Pasta", category: "Pantry", quantity: 2, priority: "low", purchased: false },
    { name: "Tomato Sauce", category: "Pantry", quantity: 2, priority: "medium", purchased: true },
    { name: "Granola Bars", category: "Snacks", quantity: 5, priority: "medium", purchased: false },
    { name: "Dark Chocolate", category: "Snacks", quantity: 2, priority: "low", purchased: false },
    { name: "Eggs", category: "Dairy", quantity: 12, priority: "high", purchased: false },
];

async function seed() {
    // 1. Setup the Users table first
    await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )
    `;

    // 2. Setup Grocery Items table with the added user_id foreign key constraint
    await sql`
        CREATE TABLE IF NOT EXISTS grocery_items (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          purchased BOOLEAN NOT NULL DEFAULT FALSE,
          priority TEXT NOT NULL DEFAULT 'medium',
          updated_at BIGINT NOT NULL,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
        )
    `;

    // 3. Create a mock target user so the foreign key has a valid point of reference
    const mockUserId = crypto.randomUUID();
    const mockUserEmail = "user@example.com";
    // This string is a pre-calculated mock bcrypt hash matching: 'password123'
    const dummyHashedPassword = "$2b$10$wK3TfO/M1DqL.Uv6mB64I.D8M0pZp7m6H4yOQeC8CgWnK2pZ9xR3.";

    await sql`
        INSERT INTO users (id, email, password)
        VALUES (${mockUserId}, ${mockUserEmail}, ${dummyHashedPassword})
        ON CONFLICT (email) DO NOTHING
    `;

    console.log(`Seeded or verified target account: ${mockUserEmail}`);

    // 4. Inject the relational mockUserId into the grocery items payload loop
    for (const item of seedItems) {
        await sql`
            INSERT INTO grocery_items (id, name, category, quantity, purchased, priority, updated_at, user_id)
            VALUES (
              ${crypto.randomUUID()},
              ${item.name},
              ${item.category},
              ${item.quantity},
              ${item.purchased},
              ${item.priority},
              ${Date.now()},
              ${mockUserId}
            )
        `;
    }

    console.log(`Seed complete: Assigned ${seedItems.length} grocery items cleanly to user: ${mockUserEmail}`);
}

seed().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});