import React, { useState, useEffect } from 'react';
import { ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Box, VStack, HStack, Text, Heading, Icon,
  Avatar, AvatarFallbackText,
  Input, InputField, InputSlot, InputIcon,
  Button, ButtonText, ButtonIcon,
  Divider, Badge, BadgeText,
  Toast, ToastTitle, useToast,
  Pressable
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/theme';
import { apiUrl } from '@/constants/api';

export default function AdminWebDashboard() {
  const router = useRouter();
  const toast = useToast();

  const [userCount, setUserCount] = useState(0);
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const usersResponse = await fetch(apiUrl('/api/users'));
      const usersData = await usersResponse.json();
      if (usersResponse.ok) {
        setUserCount(usersData.length);
      } else {
        console.error('Failed to fetch user count:', usersData.message);
      }

      const coursesResponse = await fetch(apiUrl('/api/courses'));
      const coursesData = await coursesResponse.json();
      if (coursesResponse.ok) {
        const activeCourses = coursesData.filter((course: any) => course.status === 'active').length;
        setActiveCoursesCount(activeCourses);
      } else {
        console.error('Failed to fetch courses:', coursesData.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard counts:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const STATS = [
    { label: 'Total User', value: userCount, icon: 'people', color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Kelas Aktif', value: activeCoursesCount, icon: 'calendar', color: '#10B981', bg: '#ECFDF5' },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 50 }}>

      <HStack justifyContent="space-between" alignItems="center" mb="$6">
        <Heading size="xl">Dashboard</Heading>
      </HStack>

      <HStack flexWrap="wrap" mx="-$2" mb="$8">
        {STATS.map((stat, index) => (
          <Box key={index} bg="$white" p="$5" borderRadius="$xl" flex={1} minWidth={220} m="$2" borderColor="$borderLight200" borderWidth={1} shadowColor="$backgroundLight800" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} elevation={2}>
              <HStack justifyContent="space-between" alignItems="flex-start" mb="$4">
              <Box bg={stat.bg} p="$3" borderRadius="$lg"><Ionicons name={stat.icon} color={stat.color} size={24} /></Box>
              </HStack>
              <Text size="sm" color="$textLight500" mb="$1" fontWeight="$medium">{stat.label}</Text>
              <Heading size="2xl" color="$textLight900">{stat.value}</Heading>
              {stat.sub && <Text size="xs" color={stat.color} fontWeight="$bold" mt="$2">{stat.sub}</Text>}
          </Box>
        ))}
      </HStack>
      <Box bg="$white" p="$6" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" h={300} justifyContent="center" alignItems="center">
          <Ionicons name="bar-chart" size={24} color={COLORS.primary + '50'} mb="$4" />
          <Text color="$textLight500">Grafik Aktivitas Sistem</Text>
      </Box>
    </ScrollView>
  );
}

