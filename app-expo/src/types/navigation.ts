import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Define types for individual navigators
export type AuthStackParamList = {
  Login: undefined; // Or define params if Login has any
  RegisterMobile: undefined; // Or define params if RegisterMobile has any
};

export type StudentTabParamList = {
  Home: undefined;
  Academy: undefined;
  Enroll: undefined; // New Enroll tab
  Courses: undefined;
  Profile: undefined;
};

export type AdminStackParamList = {
  Dashboard: undefined; // Admin Dashboard takes no params
};

// Define the parameter list for the RootStack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Student: NavigatorScreenParams<StudentTabParamList>;
  Admin: NavigatorScreenParams<AdminStackParamList>;
  // Add other top-level screens if any
};

// You can also define specific navigation prop types if needed,
// for components that need to navigate within a specific stack.
// For WebNavbar, it navigates to 'Admin' screen within the RootStack.
export type WebNavbarNavigationProp = StackNavigationProp<RootStackParamList>;
