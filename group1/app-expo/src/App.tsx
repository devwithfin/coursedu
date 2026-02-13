import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './navigation/AuthNavigator';
import StudentNavigator from './navigation/StudentNavigator';
import AdminNavigator from './navigation/AdminNavigator';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

const RootStack = createStackNavigator();

const linking = {
  prefixes: [],
  config: {
    screens: {
      Auth: {
        path: '', // Auth routes at the root
        screens: {
          Login: 'login',
        },
      },
      Admin: {
        path: 'admin', // Admin routes moved to /admin
        screens: {
          Dashboard: 'dashboard',
          'Manage Member': 'member',
          'Manage Academy': 'academy',
          'Manage Enrollment': 'enrollment',
        },
      },
      Student: {
        path: 'student',
        screens: {
          Home: 'home',
          Academy: 'academy',
          Enroll: 'enroll',
          Attendance: 'attendance',
          Profile: 'profile',
        },
      },
    },
  },
};

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : user.role === 'admin' ? (
          <RootStack.Screen name="Admin" component={AdminNavigator} />
        ) : (
          <RootStack.Screen name="Student" component={StudentNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
