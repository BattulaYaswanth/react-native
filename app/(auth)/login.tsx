import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useAuth } from "@/components/auth";
import {Link} from "expo-router";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!email || !password)
            return Alert.alert("Error", "Please fill in all fields");

        try {
            const response = await fetch("http://10.0.2.2:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                await signIn(data.token);
            } else {
                Alert.alert(
                    "Authentication Failed",
                    data.message || "Invalid credentials"
                );
            }
        } catch (error) {
            Alert.alert(
                "Network Error",
                "Unable to connect to the authentication server."
            );
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-100"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View className="flex-1 items-center justify-center px-6">
                <View className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg">
                    <Text className="text-4xl font-bold text-slate-900 text-center">
                        Welcome Back
                    </Text>

                    <Text className="mt-2 text-center text-slate-500">
                        Sign in to continue
                    </Text>

                    <View className="mt-8 space-y-4">
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#94A3B8"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
                        />

                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#94A3B8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        activeOpacity={0.85}
                        className="mt-8 rounded-xl bg-blue-600 py-4"
                    >
                        <Text className="text-center text-base font-semibold text-white">
                            Sign In
                        </Text>
                    </TouchableOpacity>

                    <Text className="text-center text-slate-600">
                        Does&#39;t have an account?{" "}
                        <Link href={"/registration"} className="text-blue-600 font-semibold">Sign Up</Link>
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}