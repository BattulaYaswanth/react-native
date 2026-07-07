import {getUserById} from "@/lib/server/db-actions";

export async function GET(request: Request,{id}: { id: string }) {
    try {
        const user = await getUserById(id);
        if (!user) {
            return Response.json({error: "User not found"}, {status: 404});
        }
        return Response.json({user},{status:200});
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create user";
        return Response.json({error: message}, {status: 500});
    }
}