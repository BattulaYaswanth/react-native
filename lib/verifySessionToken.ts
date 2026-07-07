import { Router } from "expo-router";

interface VerifySessionParams {
    userToken: string | null;
    segments: string[];
    router: Router;
    setIsValidating: (validating: boolean) => void;
    signOut: () => Promise<void> | void;
    isNavigationReady: boolean; // <-- Add this new check flag
}

export const verifySessionToken = async ({
                                             userToken,
                                             segments,
                                             router,
                                             setIsValidating,
                                             signOut,
                                             isNavigationReady // <-- Destructure it
                                         }: VerifySessionParams): Promise<void> => {
    // If the native navigator isn't mounted yet, bail out early and wait for the next tick
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!userToken) {
        setIsValidating(false);
        if (!inAuthGroup) router.replace('/(auth)/login' as any);
        return;
    }

    try {
        const res = await fetch("/api/users/check-token", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            if (inAuthGroup) router.replace('/(tabs)' as any);
        } else {
            await signOut();
            if (!inAuthGroup) router.replace('/(auth)/login' as any);
        }
    } catch (error) {
        console.error("Network check failed:", error);
        if (!inAuthGroup) router.replace('/(auth)/login' as any);
    } finally {
        setIsValidating(false);
    }
};