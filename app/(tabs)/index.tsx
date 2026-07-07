import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/components/auth";

export default function HomeScreen() {
    const {signOut} = useAuth();
    return (
        <SafeAreaView>
            <View>
                <Text>Home Screen</Text>
            </View>
            <Pressable onPress={signOut}>
                <Text>Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    );
}