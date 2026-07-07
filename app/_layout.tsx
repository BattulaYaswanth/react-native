import {Slot, useNavigationContainerRef, useRouter, useSegments} from 'expo-router';
import {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useAuth, AuthProvider} from "@/components/auth";
import "../global.css";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {useColorScheme} from "nativewind";
import {verifySessionToken} from "@/lib/verifySessionToken";

function InitialLayout() {
    const { userToken, isLoading: authLoading, signOut } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    // Add a local state to trace network validation status
    const rootNavigationRef = useNavigationContainerRef();
    const [isNavigationReady, setIsNavigationReady] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    useEffect(() => {
        const unsubscribe = rootNavigationRef?.addListener('state', () => {
            setIsNavigationReady(true);
        });

        // Check if it's already ready on mount
        if (rootNavigationRef?.isReady()) {
            setIsNavigationReady(true);
        }

        return unsubscribe;
    }, [rootNavigationRef]);
    useEffect(() => {
        // Wait until your auth state hydration loader finishes reading from local disk
        if (authLoading) return;
        verifySessionToken({
            userToken,
            segments,
            router,
            setIsValidating,
            signOut,
            isNavigationReady
        });
    }, [userToken, authLoading, segments, router, signOut,isNavigationReady]);

    // Keep the splash/loader running until both storage hydration AND endpoint handshake finish
    if (authLoading || isValidating) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#10B981" />
            </View>
        );
    }

    return <Slot />;
}
export default function RootLayout() {
    const {colorScheme} = useColorScheme();
    return (
        <AuthProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <InitialLayout/>
            </ThemeProvider>
        </AuthProvider>
    );
}
