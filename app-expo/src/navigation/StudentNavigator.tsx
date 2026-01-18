import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import { RootStackParamList } from '../types/navigation'; // Import RootStackParamList
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'; // Import BottomTabBarProps

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import AcademyNavigator from './AcademyNavigator'; // Import the new AcademyNavigator
import StudentDashboardScreen from '../screens/student/dashboard/Dashboard.mobile';

import ProfileScreen from '../screens/student/profile/Profile.mobile'; // Import the new ProfileScreen
import EnrollScreen from '../screens/student/enroll/Enroll.mobile'; // Import the new EnrollScreen
import AttendanceScreen from '../screens/student/attendance/Attendance.mobile'; // Import the new AttendanceScreen
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import MobileLayout from '../layouts/MobileLayout'; // Import MobileLayout

const Tab = createBottomTabNavigator();

const { width } = Dimensions.get('window');

const getIconName = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return 'home';
    case 'Academy':
      return 'school';
    case 'Enroll': // New case for Enroll tab
      return 'account-plus'; // Icon for Enroll
    case 'Attendance':
      return 'calendar-check';

    case 'Profile':
      return 'account';
    default:
      return 'help-circle';
  }
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    height: 80, // Further increased height to make it appear taller
    position: 'relative', // Needed for absolute positioning of highlight
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'relative', // Ensure highlight can be positioned relative to this button
  },
  highlightCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -30, // Halfway out of the tab bar (height of tab bar is 60, radius is 30)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default function StudentNavigator() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, logout: authLogout } = useAuth(); // Use useAuth to get user and logout function

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
              await authLogout(); // Use the logout function from AuthContext
              navigation.replace('Auth', undefined);
            } catch (error: unknown) {
              Alert.alert("Logout Error", (error as Error).message || "Failed to log out.");
            }
          }
        }
      ]
    );
  };

  return (
    <MobileLayout>
      <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => console.log('Notification Bell Pressed')} style={{ marginRight: 15 }}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#083D7F" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <MaterialCommunityIcons name="logout" size={24} color="#083D7F" />
            </TouchableOpacity>
          </View>
        ),
        // Replace headerTitleAlign with a custom headerTitle component
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
            <MaterialCommunityIcons name="account-circle" size={50} color="#083D7F" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>Welcome,</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#083D7F' }}>{user?.name || 'Guest'}</Text>
            </View>
          </View>
        ),
        headerTintColor: '#083D7F', // This might not be needed anymore since we are using a custom headerTitle
        headerStyle: {
          backgroundColor: '#F9FAFB',
        }
      }}
      tabBar={(props: BottomTabBarProps) => {
        // Define which tab should have the central highlight
        // For 5 tabs, the middle one ('Enroll') is at index 2
        const highlightedTabIndex = 2; // Index of 'Enroll' tab

        return (
          <View style={styles.tabBarContainer}>
            {props.state.routes.map((route, index) => {
              const { options } = props.descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = props.state.index === index;

              const onPress = () => {
                const event = props.navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  props.navigation.navigate(route.name, route.params);
                }
              };

              const onLongPress = () => {
                props.navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              const iconName = getIconName(route.name);

              const isHighlightedTab = index === highlightedTabIndex;

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.tabButton}
                >
                  {isHighlightedTab && (
                    <View style={[styles.highlightCircle, {
                      backgroundColor: '#083D7F', // Background color of the highlight
                    }]}>
                      {/* Icon inside the highlight */}
                      <MaterialCommunityIcons
                        name={iconName}
                        size={26}
                        color={'#F9FAFB'} // Always white for the highlighted icon
                      />
                    </View>
                  )}
                  {!isHighlightedTab && (
                      <MaterialCommunityIcons
                        name={iconName}
                        size={isFocused ? 26 : 24}
                        color={isFocused ? '#083D7F' : '#666'}
                      />
                  )}
                  <Text
                    style={{
                      color: isFocused ? '#083D7F' : '#666',
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginTop: isHighlightedTab ? 5 : 0, // Adjust text position for highlighted tab
                    }}
                  >
                    {String(label)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
    >
      <Tab.Screen
        name="Home" // Changed from Dashboard
        component={StudentDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} /> // Changed icon
          ),
        }}
      />
      <Tab.Screen
        name="Academy" // New tab
        component={AcademyNavigator} // For now, points to Dashboard
        options={({ route }) => ({
          tabBarLabel: 'Academy',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="school" color={color} size={size} /> // Academy icon
          ),
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "AcademyList";
            if (routeName === 'Class') {
              return { display: 'none' };
            }
            return;
          })(route),
        })}
      />
      <Tab.Screen
        name="Enroll" // New central tab
        component={EnrollScreen}
        options={{
          tabBarLabel: 'Enroll',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-plus" color={color} size={size} /> // Plus circle icon
          ),
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" color={color} size={size} /> // Calendar check icon
          ),
        }}
      />

      <Tab.Screen
        name="Profile" // Changed from RegistCourse
        component={ProfileScreen} // Points to the new ProfileScreen
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} /> // Profile icon
          ),
        }}
      />
          </Tab.Navigator>
        </MobileLayout>  );
}
