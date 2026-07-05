import {Slot, useRouter, useSegments} from 'expo-router';
import {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useAuth, AuthProvider} from "@/components/auth";
import "../global.css";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {useColorScheme} from "nativewind";

function InitialLayout() {
    const { userToken, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Check if user is currently inside the (auth) group
        const inAuthGroup = segments[0] === '(auth)';

        // Defer navigation to the next macro-task tick
        const timeout = setTimeout(() => {
            if (!userToken && !inAuthGroup) {
                // Redirect to the sign-in page if not authenticated
                router.replace('/(auth)/login');
            } else if (userToken && inAuthGroup) {
                // Redirect to the main app if authenticated
                router.replace('/(tabs)');
            }
        }, 0);

        // Clear timeout if the component unmounts before executing
        return () => clearTimeout(timeout);

        // Note: Removed 'router' from dependencies as it's a stable object
        // and doesn't need to trigger this effect again.
    }, [userToken, isLoading, segments, router]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
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
