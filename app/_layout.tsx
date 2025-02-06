import { Stack, useRouter, useSegments } from 'expo-router';
import { ThemeProvider as AppThemeProvider } from '../src/providers/ThemeProvider';
import { AuthProvider, useAuth } from '../src/providers/AuthProvider';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Ensure authentication state is maintained
function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!loading) {
      if (!user && !inAuthGroup) {
        // Redirect to the login page if not authenticated and not in auth group
        router.replace('/(auth)/login');
      } else if (user && inAuthGroup) {
        // Redirect to the home page if authenticated and in auth group
        router.replace('/(tabs)');
      }
    }
  }, [user, segments, loading]);
}

export default function RootLayout() {
  

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  useProtectedRoute();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <PaperProvider>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen 
                  name="modal" 
                  options={{ 
                    presentation: 'modal',
                    headerShown: false 
                  }} 
                />
                <Stack.Screen 
                  name="search" 
                  options={{
                    presentation: 'modal',
                    headerShown: false,
                  }}
                />
                <Stack.Screen 
                  name="calculators/[id]" 
                  options={{
                    headerShown: true,
                    headerBackTitle: 'Back',
                  }}
                />
              </Stack>
            </AuthProvider>
          </PaperProvider>
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
