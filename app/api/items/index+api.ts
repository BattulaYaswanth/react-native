import {createGroceryItem, getGroceryItems} from "@/lib/server/db-actions";

export async function GET() {
    try {
        const items = await getGroceryItems();
        return Response.json({items});
    } catch (e) {
        const message = e instanceof Error ? e.message :
            "Failed to fetch grocery items";
        return Response.json({error: message}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {name, category, quantity, priority,userId} = body;

        if (!name || !category || !priority) {
            return Response.json({error: "Please provide all required fields."}, {status: 400});
        }

        const item = await createGroceryItem({name, category, quantity, priority,userId});

        return Response.json({item}, {status: 201});
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create item";
        return Response.json({error: message}, {status: 500});
    }
}