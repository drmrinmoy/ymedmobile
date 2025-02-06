import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack>
    
      <Stack.Screen 
        name="help" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="security" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="preferences" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="contact" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="guidelines/[id]" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="cases/[id]" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="calculators/[id]" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="quizzes/[id]" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="drugs/[id]" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
      <Stack.Screen
        name="subscription"
        options={{
          presentation: 'modal',
          title: 'Subscription'
        }}
      />
      <Stack.Screen 
        name="plans" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
    </Stack>

  );
} 