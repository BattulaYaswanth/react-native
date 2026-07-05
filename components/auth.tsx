import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
    userToken: string | null;
    isLoading: boolean;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load token from native storage on boot
    useEffect(() => {
        async function loadToken() {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) setUserToken(token);
            } catch (e) {
                console.error("Failed to load token", e);
            } finally {
                setIsLoading(false);
            }
        }
        loadToken();
    }, []);

    const signIn = async (token: string) => {
        await SecureStore.setItemAsync('userToken', token);
        setUserToken(token);
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}