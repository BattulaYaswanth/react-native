import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import {Link} from "expo-router";

function RegisterScreen(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            return Alert.alert("Error", "Please fill in all fields.");
        }

        if (password !== confirmPassword) {
            return Alert.alert("Error", "Passwords do not match.");
        }

        try {
            const response = await fetch("http://10.0.2.2:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Account created successfully!");
            } else {
                Alert.alert("Registration Failed", data.message || "Please try again.");
            }
        } catch (error) {
            Alert.alert("Network Error", "Unable to connect to the server.");
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-100"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View className="flex-1 justify-center items-center px-6">
                <View className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-lg">
                    <Text className="text-3xl font-bold text-center text-slate-900">
                        Create Account
                    </Text>

                    <Text className="text-center text-slate-500 mt-2">
                        Sign up to get started
                    </Text>

                    <View className="mt-8">
                        <TextInput
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900"
                            placeholderTextColor="#94A3B8"
                        />

                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 mt-4 text-slate-900"
                            placeholderTextColor="#94A3B8"
                        />

                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 mt-4 text-slate-900"
                            placeholderTextColor="#94A3B8"
                        />

                        <TextInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 mt-4 text-slate-900"
                            placeholderTextColor="#94A3B8"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleRegister}
                        activeOpacity={0.8}
                        className="bg-blue-600 rounded-xl py-4 mt-8"
                    >
                        <Text className="text-center text-white font-semibold text-base">
                            Create Account
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="mt-6">
                        <Text className="text-center text-slate-600">
                            Already have an account?{" "}
                            <Link href={"/login"} className="text-blue-600 font-semibold">Sign In</Link>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
export default RegisterScreen;