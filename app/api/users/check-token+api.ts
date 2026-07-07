import jwt from "jsonwebtoken";
import { secretKey } from "./login-user+api";

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return Response.json({ error: "No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secretKey);

        return Response.json({ valid: true, decoded }, { status: 200 });
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return Response.json({ error: "Token expired", expired: true }, { status: 401 });
        }
        const message = error instanceof Error ? error.message : "Invalid session";
        return Response.json({ error: message }, { status: 500 });
    }
}