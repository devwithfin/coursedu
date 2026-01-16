import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import { RootStackParamList } from '../types/navigation'; // Import RootStackParamList

import StudentDashboardScreen from '../screens/student/dashboard/Dashboard.mobile';
import CourcesScreen from '../screens/student/courses/Cources.mobile';
import RegistCourseScreen from '../screens/student/regist-course/RegistCourse.mobile';

import { logout } from '../api/auth';

const Tab = createBottomTabNavigator();

export default function StudentNavigator() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); // Type navigation with StackNavigationProp

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
            try {
              await logout();
              // Clear any local storage/state for token here later
              navigation.replace('Auth', undefined);
            } catch (error: unknown) { // Explicitly type error as unknown
              Alert.alert("Logout Error", (error as Error).message || "Failed to log out.");
            }
          }
        }
      ]
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#083D7F',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#F9FAFB',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarIconStyle: {
          marginBottom: -3,
        },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <MaterialCommunityIcons name="logout" size={24} color="#083D7F" />
          </TouchableOpacity>
        ),
        headerTitleAlign: 'left',
        headerTintColor: '#083D7F',
        headerStyle: {
          backgroundColor: '#F9FAFB',
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={StudentDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CourcesScreen}
        options={{
          tabBarLabel: 'Courses',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="RegistCourse"
        component={RegistCourseScreen}
        options={{
          tabBarLabel: 'Register',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-plus-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
