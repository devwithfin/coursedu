import { Stack } from 'expo-router';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { ToastProvider } from '@gluestack-ui/toast'; // Added import for ToastProvider

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <ToastProvider> {/* Wrapped Stack with ToastProvider */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          {/* Hapus baris ini jika file dashboard.tsx ada di root 'app',
              tapi jika ada di dalam (tabs), biarkan Stack mengaturnya otomatis */}
          {/* <Stack.Screen name="dashboard" /> */}
        </Stack>
      </ToastProvider>
    </GluestackUIProvider>
  );
}
