import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AcademyStackParamList } from '../types/navigation';
import AcademyScreen from '../screens/student/academy/Academy.mobile';
import ClassScreen from '../screens/student/academy/Class.mobile';
import ScheduleListScreen from '../screens/student/academy/ScheduleList.mobile';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AcademyStack = createStackNavigator<AcademyStackParamList>();

export default function AcademyNavigator() {
  const navigation = useNavigation();

  return (
    <AcademyStack.Navigator>
      <AcademyStack.Screen 
        name="AcademyList" 
        component={AcademyScreen} 
        options={{ headerShown: false }}
      />
      <AcademyStack.Screen
        name="Class"
        component={ClassScreen}
        options={{ headerShown: false }}
      />
      <AcademyStack.Screen
        name="ScheduleList"
        component={ScheduleListScreen}
        options={{ headerShown: false }}
      />
    </AcademyStack.Navigator>
  );
}
