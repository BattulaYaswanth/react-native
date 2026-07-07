import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';
import {useColorScheme} from "nativewind";

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {useNavigationContainerRef, useRouter, useSegments} from 'expo-router';
import {useAuth} from "@/components/auth";
import {verifySessionToken} from "@/lib/verifySessionToken";

export default function TabLayout() {
    const { colorScheme } = useColorScheme();
    const { userToken, signOut, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const segments = useSegments();
    const rootNavigationRef = useNavigationContainerRef();
    const [isNavigationReady, setIsNavigationReady] = useState(false);
    const [isValidating, setIsValidating] = useState(true);

    const isDark = colorScheme === 'dark';
    const tintColor = isDark ? 'hsl(142 70% 54%)' : 'hsl(147 75% 33%)';

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
        // Wait until auth state hydrates from local device storage
        if (authLoading) return;

        // Perform the token validation handshake
        verifySessionToken({
            userToken,
            segments,
            router,
            setIsValidating,
            signOut,
            isNavigationReady
        });
    }, [userToken, authLoading, segments, router, signOut,isNavigationReady]);

    // Prevent rendering UI flicker while validating the token layout state
    if (authLoading || isValidating) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#000' : '#fff' }}>
                <ActivityIndicator size="large" color={tintColor} />
            </View>
        );
    }

    return (
        <NativeTabs tintColor={tintColor}>
            <NativeTabs.Trigger name="index">
                <Label>List</Label>
                <Icon
                    sf={{ default: "list.bullet.clipboard", selected: "list.bullet.clipboard.fill" }}
                    drawable="ic_menu_view"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="planner">
                <Label>Planner</Label>
                <Icon
                    sf={{ default: "plus.circle", selected: "plus.circle.fill" }}
                    drawable="ic_menu_agenda"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="insights">
                <Label>Insights</Label>
                <Icon
                    sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
                    drawable="ic_menu_manage"
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}