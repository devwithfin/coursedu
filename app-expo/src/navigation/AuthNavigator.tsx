import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';

import LoginMobileScreen from '../screens/auth/Login.mobile';
import LoginWebScreen from '../screens/auth/Login.web';
import RegisterMobileScreen from '../screens/auth/Register.mobile'; 
const AuthStack = createStackNavigator();

export default function AuthNavigator() {
  const LoginScreenComponent = Platform.select({
    web: LoginWebScreen,
    default: LoginMobileScreen,
  });

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreenComponent} />
      {Platform.OS !== 'web' && (
        <AuthStack.Screen name="RegisterMobile" component={RegisterMobileScreen} />
      )}
    </AuthStack.Navigator>
  );
}
