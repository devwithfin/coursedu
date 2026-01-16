import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Removed Platform import, LoginMobileScreen, LoginWebScreen
import AuthNavigator from './navigation/AuthNavigator'; // Import AuthNavigator

import StudentNavigator from './navigation/StudentNavigator';
import AdminNavigator from './navigation/AdminNavigator';

// Removed LoginScreen Platform.select logic

const RootStack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Auth" component={AuthNavigator} /> 
 {/* Use AuthNavigator */}
          <RootStack.Screen name="Student" component={StudentNavigator} />
          <RootStack.Screen name="Admin" component={AdminNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
