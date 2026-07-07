import {createUser, getUserByEmail} from "@/lib/server/db-actions";
import * as Crypto from "expo-crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {email, password, confirmPassword} = body;
        if (password !== confirmPassword) {
            return Response.json({error: "Passwords do not match"}, {status: 400});
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return Response.json({error: "User already exists"}, {status: 400});
        }
        const hashPassword = await hashLocalPin(password);
        const user = await createUser({email, password:hashPassword});
        return Response.json({user:user}, {status: 201});
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create user";
        return Response.json({error: message}, {status: 500});
    }
}

const LOCAL_SALT = "grocify_app_secure_salt_string_123!!";

export const hashLocalPin = async (pin: string) => {
    // Combine the pin and salt to prevent basic rainbow table lookups
    const combinedInput = `${pin}${LOCAL_SALT}`;

    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        combinedInput,
        {encoding: Crypto.CryptoEncoding.HEX}
    );
};