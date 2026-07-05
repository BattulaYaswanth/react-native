import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/components/auth";

export default function HomeScreen() {
    const { signOut, userToken } = useAuth();

    const getDisplayEmail = () => {
        if (!userToken) return 'User';
        try {
            const payloadBase64 = userToken.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return decodedPayload.sub || 'User';
        } catch {
            return 'Authenticated User';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="flex-1 justify-center items-center p-6">
                <Text className="text-3xl font-bold text-slate-900 mb-2">Welcome Home! 👋</Text>
                <Text className="text-sm text-slate-400 mb-2">Logged in as:</Text>

                <View className="bg-slate-200 px-4 py-2 rounded-full mb-8">
                    <Text className="text-slate-700 font-semibold text-sm">{getDisplayEmail()}</Text>
                </View>

                <Text className="text-center text-slate-500 leading-6 px-4 mb-10">
                    This screen is completely protected. If you don't have a valid local token,
                    the application router will automatically kick you back to the login page.
                </Text>

                <TouchableOpacity
                    className="bg-red-500 py-4 px-12 rounded-xl active:bg-red-600 shadow-sm"
                    onPress={signOut}
                >
                    <Text className="text-white text-base font-bold">Log Out Safely</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}