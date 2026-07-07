import {getUserByEmail} from "@/lib/server/db-actions";
import {hashLocalPin} from "@/app/api/users/create-user+api";
import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: string;
    email: string;
}

export const secretKey: string = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {email,password} = body;
        const user = await getUserByEmail(email);
        if (!user) {
            return Response.json({error: "User not found"}, {status: 404});
        }
        const hashPassword = await hashLocalPin(password);
        if (user.password !== hashPassword) {
            return Response.json({error: "Invalid Credentials"}, {status: 401});
        }
        const token = generateToken({userId:user.id,email:user.email});
        return Response.json({user,token:token},{status:200});
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create user";
        return Response.json({error: message}, {status: 500});
    }
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, secretKey, { expiresIn: "15m" });
};