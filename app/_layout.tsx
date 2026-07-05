import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {useAuth,AuthProvider} from "@/components/auth";
import "../global.css";

function InitialLayout() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if user is currently inside the (auth) group
    const inAuthGroup = segments[0] === '(auth)';

    if (!userToken && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated
      router.replace('/(auth)/login');
    } else if (userToken && inAuthGroup) {
      // Redirect to the main app if authenticated
      router.replace('/(home)');
    }
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
  return (
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
  );
}
