import React, { useState, useEffect } from 'react';
import { useRouter, Slot, Stack } from 'expo-router';
import {
  Box, VStack, HStack, Text, Heading,
  Avatar, AvatarFallbackText,
  Input, InputField, InputSlot,
  Button, ButtonText,
  Divider, Badge, BadgeText,
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../../constants/theme';

const SidebarItem = ({ item, activeTab, setActiveTab, COLORS, router }: { item: any, activeTab: string, setActiveTab: (tab: string) => void, COLORS: any, router: any }) => {
  const isActive = activeTab === item.id;
  return (
    <Button
      variant="outline"
      action="primary"
      borderWidth={0}
      justifyContent="flex-start"
      h="$12"
      mb="$1"
      bg={isActive ? COLORS.primary + '15' : 'transparent'}
      onPress={() => {
        setActiveTab(item.id);
        if (item.href) {
          router.push(item.href);
        }
      }}
      style={{ borderRadius: 8 }}
      sx={{
        ':hover': {
          bg: isActive ? COLORS.primary + '20' : '$backgroundLight100',
        },
        _text: {
          textDecorationLine: 'none',
        }
      }}
    >
      <Ionicons name={item.icon} color={isActive ? COLORS.primary : '$textLight500'} size={18} style={{ marginRight: 12 }} />
      <ButtonText 
        color={isActive ? COLORS.primary : '$textLight700'} 
        fontWeight={isActive ? '$bold' : '$normal'} 
        size="sm"
        style={{ textDecorationLine: 'none' }}
      >
        {item.label}
      </ButtonText>
    </Button>
  );
};

export default function ManagerLayout() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const role = await AsyncStorage.getItem('userRole');
      if (!role || role !== 'manager') {
        router.replace('/');
      } else {
        setIsReady(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userRole');
    router.replace('/');
  };

  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/manager/dashboard' },
    { id: 'attendance', label: 'Kehadiran', icon: 'stats-chart', href: '/manager/attendance-summary' },
    { id: 'grades', label: 'Nilai', icon: 'ribbon', href: '/manager/grade-summary' },
  ];

  if (!isReady) return null;

  return (
    <Box flex={1} bg="$backgroundLight100">
      <Stack.Screen options={{ title: 'LMS' }} />

      <HStack flex={1} h="100%">
        {/* SIDEBAR - Responsive Logic */}
        {isSidebarOpen && (
          <Box 
            width={260} 
            bg="$white" 
            borderRightWidth={1} 
            borderColor="$borderLight200" 
            pt="$6" 
            px="$4" 
            position="absolute"
            h="100%"
            zIndex={100}
            sx={{ 
              '@md': { 
                position: 'relative',
                display: 'flex' 
              } 
            }}
          >
            <HStack alignItems="center" mb="$4" px="$2" justifyContent="space-between">
              <HStack alignItems="center">
                <Box w={36} h={36} bg={COLORS.primary} borderRadius="$md" mr="$3" alignItems="center" justifyContent="center">
                  <Text color="white" fontWeight="bold" size="xl">M</Text>
                </Box>
                <VStack>
                  <Heading size="sm" color="$textLight900">LMS Manager</Heading>
                  <Text size="xs" color="$textLight500">Management</Text>
                </VStack>
              </HStack>
              {/* Close button for mobile */}
              <Box sx={{ '@md': { display: 'none' } }}>
                <Button variant="link" onPress={() => setIsSidebarOpen(false)}>
                  <Ionicons name="close" size={24} color="$textLight500" />
                </Button>
              </Box>
            </HStack>

            <Divider my="$4" bg="$borderLight200" />

            <VStack flex={1}>
              {MENU_ITEMS.map((item) => <SidebarItem key={item.id} item={item} activeTab={activeTab} setActiveTab={setActiveTab} COLORS={COLORS} router={router} />)}
            </VStack>

            <Divider my="$4" />
            <Button 
              variant="outline" 
              action="negative"
              borderWidth={0}
              justifyContent="flex-start" 
              mb="$6" 
              onPress={handleLogout}
              sx={{
                ':hover': { bg: '$red100' },
                _text: { textDecorationLine: 'none' }
              }}
            >
              <Ionicons name="log-out" color="$red500" size={18} style={{ marginRight: 12 }} />
              <ButtonText color="$red500" style={{ textDecorationLine: 'none' }}>Keluar</ButtonText>
            </Button>
          </Box>
        )}

        {/* CONTENT AREA */}
        <VStack flex={1} h="100%">
          {/* HEADER */}
          <HStack bg={COLORS.primary} h={80} alignItems="center" justifyContent="space-between" px="$4" sx={{ '@md': { px: '$8' } }} shadowColor="#000" shadowOffset={{width:0, height:2}} shadowOpacity={0.1} elevation={4}>
            <HStack alignItems="center" space="md" flex={1}>
              <Button variant="link" onPress={() => setIsSidebarOpen(!isSidebarOpen)} mr="$2">
                <Ionicons name="menu" color="white" size={24} />
              </Button>
              <Input variant="outline" size="sm" flex={1} maxWidth={300} bg="white" borderColor="transparent" borderRadius="$full">
                <InputSlot pl="$3"><Ionicons name="search" color="$textLight400" size={16}/></InputSlot>
                <InputField placeholder="Cari..." />
              </Input>
            </HStack>
            <HStack alignItems="center" space="md" ml="$2">
               <Button bg="rgba(255,255,255,0.2)" borderRadius="$full" p="$2" w={36} h={36} justifyContent="center" alignItems="center" sx={{ '@base': { display: 'none' }, '@sm': { display: 'flex' } }}>
                 <Ionicons name="notifications" color="white" size={16} />
                 <Box position="absolute" top={8} right={10} w={6} h={6} bg="$red500" borderRadius="$full" />
               </Button>
               <Avatar bg="white" size="sm"><AvatarFallbackText color={COLORS.primary}>MG</AvatarFallbackText></Avatar>
            </HStack>
          </HStack>

          <Box flex={1} p="$4" sx={{ '@md': { p: '$8' } }}>
            <Slot />
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}

