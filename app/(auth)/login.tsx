import React, {useState} from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Alert, ScrollView,
} from "react-native";
import {useAuth} from "@/components/auth";
import {SafeAreaView} from "react-native-safe-area-context";
import {Image} from "expo-image";

export default function LoginScreen() {
    const {signIn} = useAuth();

    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const API_URL = process.env.EXPO_BACKEND_API_URL || "http://10.0.2.2:8000/api";

    const handleSubmit = async () => {
        if (!email || !password) {
            return Alert.alert("Error", "Please fill all required fields");
        }

        if (!isLogin) {
            if (!name) {
                return Alert.alert("Error", "Please enter your name");
            }

            if (password !== confirmPassword) {
                return Alert.alert("Error", "Passwords do not match");
            }
        }

        try {
            const endpoint = isLogin ? "/login" : "/register";

            const body = isLogin
                ? {
                    email,
                    password,
                }
                : {
                    name,
                    email,
                    password,
                    password_confirmation: confirmPassword,
                };

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    await signIn(data.token);
                } else {
                    Alert.alert(
                        "Success",
                        "Registration successful. Please sign in."
                    );

                    setIsLogin(true);
                    setPassword("");
                    setConfirmPassword("");
                }
            } else {
                Alert.alert(
                    isLogin ? "Login Failed" : "Registration Failed",
                    data.message || "Something went wrong"
                );
            }
        } catch (err) {
            Alert.alert("Network Error", "Unable to connect to the server.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primary dark:bg-secondary" edges={["top"]}>
            <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40"/>
            <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/70 dark:bg-background/35"/>

            <View className="px-6 pt-4">
                <Text
                    className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground uppercase font-mono dark:text-foreground">
                    Grocify
                </Text>

                <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground/75">
                    Plan smarter. Shop happier.
                </Text>

                <View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
                    <Image source={require("@/assets/images/auth.png")}
                           style={{width: "100%", height: 300}}
                           contentFit="contain"/>
                </View>
            </View>
            <View className="mt-8 flex-1 rounded-t-[30px] bg-card px-6 pb-8 pt-6">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 24,
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="self-center rounded-full bg-secondary px-3 py-1">
                        <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
                            Welcome Back
                        </Text>
                    </View>
                    <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
                        {isLogin
                            ? "Sign in to continue"
                            : "Register to access your dashboard"}
                    </Text>
                    <View className="mt-6 gap-4">
                        {!isLogin && (
                            <View>
                                <Text className="mb-2 text-sm font-medium text-foreground">
                                    Full Name
                                </Text>

                                <TextInput
                                    placeholder="John Doe"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                    className="rounded-2xl border border-border bg-background px-4 py-4 text-foreground"
                                />
                            </View>
                        )}

                        <View>
                            <Text className="mb-2 text-sm font-medium text-foreground">
                                Email
                            </Text>

                            <TextInput
                                placeholder="you@example.com"
                                placeholderTextColor="#9CA3AF"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                className="rounded-2xl border border-border bg-background px-4 py-4 text-foreground"
                            />
                        </View>

                        <View>
                            <Text className="mb-2 text-sm font-medium text-foreground">
                                Password
                            </Text>

                            <TextInput
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                className="rounded-2xl border border-border bg-background px-4 py-4 text-foreground"
                            />
                        </View>

                        {!isLogin && (
                            <View>
                                <Text className="mb-2 text-sm font-medium text-foreground">
                                    Confirm Password
                                </Text>

                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor="#9CA3AF"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    className="rounded-2xl border border-border bg-background px-4 py-4 text-foreground"
                                />
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="mt-2 rounded-2xl bg-primary py-4 active:opacity-90"
                        >
                            <Text className="text-center text-base font-bold text-primary-foreground">
                                {isLogin ? "Sign In" : "Create Account"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="self-center pt-2"
                            onPress={() => {
                                setIsLogin(!isLogin);
                                setName("");
                                setEmail("");
                                setPassword("");
                                setConfirmPassword("");
                            }}
                        >
                            <Text className="text-sm font-medium text-primary">
                                {isLogin
                                    ? "Don't have an account? Create one"
                                    : "Already have an account? Sign In"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}