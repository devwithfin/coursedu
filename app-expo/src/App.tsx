import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/auth/Login';

export default function App() {
  return (
    <SafeAreaProvider>
      <LoginScreen />
    </SafeAreaProvider>
  );
}
