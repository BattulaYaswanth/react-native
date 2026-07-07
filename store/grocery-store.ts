import {create} from "zustand";

export type GroceryCategory = "Produce" | "Dairy" | "Bakery" | "Pantry" | "Snacks";
export type GroceryPriority = "low" | "medium" | "high";

export type GroceryItem = {
    id: string;
    name: string;
    category: GroceryCategory;
    quantity: number;
    purchased: boolean;
    priority: GroceryPriority;
};

export type CreateItemInput = {
    name: string;
    category: GroceryCategory;
    quantity: number;
    priority: GroceryPriority;
};

type ItemsResponse = { items: GroceryItem[] };
type ItemResponse = { item: GroceryItem };

type GroceryStore = {
    items: GroceryItem[];
    isLoading: boolean;
    error: string | null;
    loadItems: () => Promise<void>;
    addItem: (input: CreateItemInput) => Promise<GroceryItem | void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    togglePurchased: (id: string) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    clearPurchased: () => Promise<void>;
};

export type User = {
    id: string;
    email: string;
};

// Update UserInput to match exactly what your POST route expects
export type UserInput = {
    email: string;
    password: string;
    confirmPassword: string;
};

export type LoginUser = {
    id: string;
    email: string;
    token:string
};

type UserStore = {
    isLoading: boolean;
    error: string | null;
    user: (id: string) => Promise<User | null>;
    loginUser: (email: string, password: string) => Promise<LoginUser | null>;
    createUser: (input: UserInput) => Promise<User | null>;
};

export const useUserStore = create<UserStore>((set, get) => ({
    isLoading: false,
    error: null,
    // 1. Fixed the GET user action
    user: async (id) => {
        set({isLoading: true, error: null});
        try {
            // Point to a standard parameterized dynamic route or query string
            const res = await fetch(`/api/users/${id}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            });

            if (!res.ok) {
                const errData = await res.json();
                set({error: errData.error || "User not found"});
                return null;
            }

            const data = await res.json();
            return data.user as User;
        } catch (error) {
            console.error("Error fetching user:", error);
            set({error: "Something went wrong"});
            return null;
        } finally {
            set({isLoading: false});
        }
    },
    loginUser: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch("/api/users/login-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                set({ error: data.error || "Failed to login" });
                return null;
            }

            // FLATTEN THE OBJECT HERE TO MATCH LoginUser
            return {
                id: data.user.id as string,
                email: data.user.email as string,
                token: data.token as string
            };

        } catch (error) {
            console.error("Error logging in:", error);
            set({ error: "Something went wrong" });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },
    // 2. Fixed the POST create user action
    createUser: async (input) => {
        set({isLoading: true, error: null});
        try {
            const res = await fetch("/api/users/create-user", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: input.email,
                    password: input.password,
                    confirmPassword: input.confirmPassword, // Added missing property
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                set({error: data.error || "Failed to create user"});
                return null;
            }

            // Your backend wrapper returns: Response.json({user: user})
            return data.user as User;
        } catch (error) {
            console.error("Error Creating user:", error);
            set({error: "Something went wrong"});
            return null;
        } finally {
            set({isLoading: false});
        }
    }
}));

export const useGroceryStore = create<GroceryStore>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    loadItems: async () => {
        set({isLoading: true, error: null});
        try {
            const res = await fetch("/api/items");
            const payload = (await res.json()) as ItemsResponse;

            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            set({items: payload.items});
        } catch (error) {
            console.error("Error loading items:", error);
            set({error: "Something went wrong"});
        } finally {
            set({isLoading: false});
        }
    },

    addItem: async (input) => {
        set({error: null});
        try {
            const res = await fetch("/api/items", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: input.name,
                    category: input.category,
                    quantity: Math.max(1, input.quantity),
                    priority: input.priority,
                }),
            });
            const payload = (await res.json()) as ItemResponse;
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            set((state) => ({items: [payload.item, ...state.items]}));
            return payload.item;
        } catch (error) {
            console.error("Error adding item:", error);
            set({error: "Something went wrong"});
        }
    },
    updateQuantity: async (id, quantity) => {
        const nextQuantity = Math.max(1, quantity);
        set({error: null});

        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({quantity: nextQuantity}),
            });
            const payload = (await res.json()) as ItemResponse;
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            set((state) => ({
                items: state.items.map((item) => (item.id === id ? payload.item : item)),
            }));
        } catch (error) {
            console.error("Error updating quantity:", error);
            set({error: "Something went wrong"});
        }
    },

    togglePurchased: async (id) => {
        const currentItem = get().items.find((item) => item.id === id);
        if (!currentItem) return;

        const nextPurchased = !currentItem.purchased;
        set({error: null});
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({purchased: nextPurchased}),
            });

            const payload = (await res.json()) as ItemResponse;
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            set((state) => ({
                items: state.items.map((item) => (item.id === id ? payload.item : item)),
            }));
        } catch (error) {
            console.error("Error toggling purchased:", error);
            set({error: "Something went wrong"});
        }
    },

    removeItem: async (id) => {
        set({error: null});
        try {
            const res = await fetch(`/api/items/${id}`, {method: "DELETE"});
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            set((state) => ({items: state.items.filter((item) => item.id !== id)}));
        } catch (error) {
            console.error("Error removing item:", error);
            set({error: "Something went wrong"});
        }
    },

    clearPurchased: async () => {
        set({error: null});
        try {
            const res = await fetch("/api/items/clear-purchased", {method: "POST"});
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const items = get().items.filter((item) => !item.purchased);
            set({items});
        } catch (error) {
            console.error("Error clearing purchased:", error);
            set({error: "Something went wrong"});
        }
    },
}));