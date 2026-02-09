import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  Box, VStack, HStack, Text, Heading, 
  Divider,
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import { COLORS } from '../../constants/theme';
import { apiUrl } from '@/constants/api';

interface ClassAvg {
  course_title: string;
  class_avg: number | string;
}

interface AttendanceStat {
  status: 'present' | 'absent' | 'late';
  count: number;
}

export default function ManagerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ 
    courses: 0, 
    students: 0, 
    teachers: 0, 
    classAverages: [] as ClassAvg[],
    attendanceStats: [] as AttendanceStat[]
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl('/api/manager/dashboard-stats'));
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const STATS = [
    { label: 'Total Murid', value: stats.students, icon: 'people', color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Kelas Aktif', value: stats.courses, icon: 'calendar', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Total Guru', value: stats.teachers, icon: 'person-circle', color: '#F59E0B', bg: '#FFFBEB' },
  ];

  const renderAttendanceSummary = () => {
    const total = stats.attendanceStats.reduce((acc, curr) => acc + Number(curr.count), 0);
    
    if (total === 0) {
      return (
        <VStack alignItems="center" justifyContent="center" h={150} space="sm">
          <Ionicons name="checkmark-circle-outline" size={40} color="#CBD5E1" />
          <Text color="$textLight400">Belum ada data absensi</Text>
        </VStack>
      );
    }

    const getPercentage = (status: string) => {
      const stat = stats.attendanceStats.find(s => s.status === status);
      return stat ? (Number(stat.count) / total * 100) : 0;
    };

    const attendanceTypes = [
      { label: 'Hadir', status: 'present', color: '$green500', icon: 'checkmark-circle' },
      { label: 'Terlambat', status: 'late', color: '$yellow500', icon: 'time' },
      { label: 'Absen', status: 'absent', color: '$red500', icon: 'close-circle' },
    ];

    return (
      <VStack space="md" mt="$4">
        <HStack h="$4" w="100%" bg="$backgroundLight100" borderRadius="$full" overflow="hidden">
          {attendanceTypes.map((type, index) => {
            const percentage = getPercentage(type.status);
            if (percentage === 0) return null;
            return (
              <Box 
                key={index}
                h="100%" 
                bg={type.color} 
                w={`${percentage}%`}
              />
            );
          })}
        </HStack>
        
        <HStack justifyContent="space-between" mt="$2">
          {attendanceTypes.map((type, index) => {
            const count = stats.attendanceStats.find(s => s.status === type.status)?.count || 0;
            const percentage = getPercentage(type.status);
            return (
              <VStack key={index} alignItems="center" flex={1}>
                <HStack space="xs" alignItems="center">
                  <Box w="$2" h="$2" borderRadius="$full" bg={type.color} />
                  <Text size="xs" color="$textLight500">{type.label}</Text>
                </HStack>
                <Text size="sm" fontWeight="$bold">{Math.round(percentage)}%</Text>
                <Text size="xs" color="$textLight400">({count})</Text>
              </VStack>
            );
          })}
        </HStack>
      </VStack>
    );
  };

  const renderGradeChart = () => {
    if (stats.classAverages.length === 0) {
      return (
        <VStack alignItems="center" justifyContent="center" h={200} space="sm">
          <Ionicons name="stats-chart-outline" size={40} color="#CBD5E1" />
          <Text color="$textLight400">Belum ada data nilai tersedia</Text>
        </VStack>
      );
    }

    return (
      <VStack space="lg" mt="$4">
        {stats.classAverages.map((item, index) => {
          const avg = Number(item.class_avg);
          return (
            <VStack key={index} space="xs">
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="sm" fontWeight="$medium" color="$textLight700" numberOfLines={1} flex={1}>
                  {item.course_title}
                </Text>
                <Text size="sm" fontWeight="$bold" color={avg >= 75 ? "$green600" : "$orange600"}>
                  {avg.toFixed(1)}
                </Text>
              </HStack>
              <Box h="$2" bg="$backgroundLight100" borderRadius="$full" overflow="hidden">
                <Box 
                  h="100%" 
                  bg={avg >= 75 ? "$green500" : "$orange500"} 
                  w={`${avg}%`} 
                  borderRadius="$full"
                />
              </Box>
            </VStack>
          );
        })}
      </VStack>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 50 }}>
      <Stack.Screen options={{ title: 'LMS', headerShown: false }} />

      <HStack justifyContent="space-between" alignItems="center" mb="$6">
        <Heading size="xl">Dashboard Manager</Heading>
      </HStack>

      <HStack flexWrap="wrap" mx="-$2" mb="$8">
        {STATS.map((stat, index) => (
          <Box 
            key={index} 
            bg="$white" 
            p="$5" 
            borderRadius="$xl" 
            flex={1} 
            minWidth={220} 
            m="$2" 
            borderColor="$borderLight200" 
            borderWidth={1} 
            shadowColor="$backgroundLight800" 
            shadowOffset={{ width: 0, height: 2 }} 
            shadowOpacity={0.05} 
            elevation={2}
          >
              <HStack justifyContent="space-between" alignItems="flex-start" mb="$4">
                <Box bg={stat.bg} p="$3" borderRadius="$lg">
                  <Ionicons name={stat.icon as any} color={stat.color} size={24} />
                </Box>
              </HStack>
              <Text size="sm" color="$textLight500" mb="$1" fontWeight="$medium">{stat.label}</Text>
              <Heading size="2xl" color="$textLight900">{stat.value}</Heading>
          </Box>
        ))}
      </HStack>

      <HStack space="lg" mb="$8" flexWrap="wrap">
        {/* Rangkuman Nilai (Chart) */}
        <Box 
          flex={1}
          minWidth={300}
          bg="$white" 
          p="$6" 
          borderRadius="$xl" 
          borderWidth={1} 
          borderColor="$borderLight200" 
          shadowColor="$backgroundLight800" 
          shadowOffset={{ width: 0, height: 2 }} 
          shadowOpacity={0.05} 
          elevation={2}
        >
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Heading size="md">Rangkuman Nilai Per Kelas</Heading>
                <Text size="xs" color="$textLight500">Rata-rata performa akademik peserta</Text>
              </VStack>
              <Ionicons name="bar-chart" size={20} color={COLORS.primary} />
            </HStack>
            
            <Divider my="$4" />

            {loading ? (
              <Box h={200} justifyContent="center" alignItems="center">
                <ActivityIndicator color={COLORS.primary} />
              </Box>
            ) : renderGradeChart()}
        </Box>

        {/* Rangkuman Absensi */}
        <Box 
          flex={1}
          minWidth={300}
          bg="$white" 
          p="$6" 
          borderRadius="$xl" 
          borderWidth={1} 
          borderColor="$borderLight200" 
          shadowColor="$backgroundLight800" 
          shadowOffset={{ width: 0, height: 2 }} 
          shadowOpacity={0.05} 
          elevation={2}
        >
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Heading size="md">Statistik Kehadiran</Heading>
                <Text size="xs" color="$textLight500">Rangkuman presensi seluruh murid</Text>
              </VStack>
              <Ionicons name="checkbox" size={20} color={COLORS.primary} />
            </HStack>
            
            <Divider my="$4" />

            {loading ? (
              <Box h={150} justifyContent="center" alignItems="center">
                <ActivityIndicator color={COLORS.primary} />
              </Box>
            ) : renderAttendanceSummary()}
        </Box>
      </HStack>
    </ScrollView>
  );
}
