import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import {
  Box, VStack, HStack, Text, Heading, Icon,
  Avatar, AvatarFallbackText,
  Button, ButtonText, ButtonIcon,
  Badge, BadgeText,
  Input, InputField, InputSlot, InputIcon,
} from '@gluestack-ui/themed';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react-native';
import axios from 'axios';
import { COLORS } from '../../constants/theme';
import { apiUrl } from '@/constants/api';

interface AttendanceSummary {
  student_id: number;
  total_sessions: number;
  present_count: string;
  absent_count: string;
  late_count: string;
  Student: {
    name: string;
    email: string;
  };
}

export default function AttendanceSummaryPage() {
  const [data, setData] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl('/api/manager/attendance-summary'));
      setData(response.data);
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const filteredData = data.filter(item => 
    item.Student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Student?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderItem = ({ item }: { item: AttendanceSummary }) => (
    <HStack p="$4" borderBottomWidth={1} borderColor="$borderLight100" alignItems="center">
      <HStack w="$1/3" alignItems="center">
        <Avatar bg={COLORS.primary} size="sm" mr="$3">
          <AvatarFallbackText>{item.Student?.name}</AvatarFallbackText>
        </Avatar>
        <VStack>
          <Text fontWeight="bold" color="$textLight900">{item.Student?.name}</Text>
          <Text size="xs" color="$textLight500">{item.Student?.email}</Text>
        </VStack>
      </HStack>
      
      <HStack w="$1/2" space="md">
        <VStack alignItems="center" flex={1}>
          <Text size="xs" color="$textLight500" mb="$1">Hadir</Text>
          <Badge action="success" variant="outline" borderRadius="$full" w={60} justifyContent="center">
            <BadgeText>{item.present_count || '0'}</BadgeText>
          </Badge>
        </VStack>
        <VStack alignItems="center" flex={1}>
          <Text size="xs" color="$textLight500" mb="$1">Terlambat</Text>
          <Badge action="warning" variant="outline" borderRadius="$full" w={60} justifyContent="center">
            <BadgeText>{item.late_count || '0'}</BadgeText>
          </Badge>
        </VStack>
        <VStack alignItems="center" flex={1}>
          <Text size="xs" color="$textLight500" mb="$1">Absen</Text>
          <Badge action="error" variant="outline" borderRadius="$full" w={60} justifyContent="center">
            <BadgeText>{item.absent_count || '0'}</BadgeText>
          </Badge>
        </VStack>
      </HStack>

      <VStack flex={1} alignItems="flex-end">
        <Text size="xs" color="$textLight500">Total Sesi</Text>
        <Text fontWeight="bold">{item.total_sessions}</Text>
      </VStack>
    </HStack>
  );

  return (
    <VStack flex={1} bg="$backgroundLight100" p="$6">
      <HStack justifyContent="space-between" alignItems="center" mb="$6">
        <Heading size="xl">Kehadiran</Heading>
        <Box w={300}>
          <Input size="sm" bg="$white">
            <InputSlot pl="$3">
              <InputIcon as={Search} size="sm" />
            </InputSlot>
            <InputField 
              placeholder="Cari nama student..." 
              value={searchQuery}
              onChangeText={(t) => {
                setSearchQuery(t);
                setCurrentPage(1);
              }}
            />
          </Input>
        </Box>
      </HStack>

      <Box flex={1} bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" overflow="hidden">
        <HStack bg="$backgroundLight50" p="$4" borderBottomWidth={1} borderColor="$borderLight200">
          <Text w="$1/3" fontWeight="$bold" color="$textLight600">STUDENT</Text>
          <Text w="$1/2" fontWeight="$bold" color="$textLight600" textAlign="center">RINGKASAN STATUS</Text>
          <Text flex={1} fontWeight="$bold" color="$textLight600" textAlign="right">TOTAL SESI</Text>
        </HStack>

        {loading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </Box>
        ) : (
          <FlatList
            data={paginatedData}
            keyExtractor={(item) => item.student_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <Box p="$10" alignItems="center">
                <Text color="$textLight400">Data tidak ditemukan.</Text>
              </Box>
            }
          />
        )}

        {/* Pagination Controls */}
        <HStack p="$4" justifyContent="space-between" alignItems="center" borderTopWidth={1} borderColor="$borderLight200" bg="$backgroundLight50">
          <Text size="sm" color="$textLight500">
            Menampilkan {filteredData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} student
          </Text>
          <HStack space="sm">
            <Button 
              size="sm" 
              variant="outline" 
              isDisabled={currentPage === 1} 
              onPress={() => setCurrentPage(p => p - 1)}
              borderColor="$borderLight300"
            >
              <ButtonIcon as={ChevronLeft} color="$textLight600" />
            </Button>
            <Box bg="white" px="$3" py="$1" borderWidth={1} borderColor="$borderLight300" borderRadius="$sm" justifyContent="center">
                <Text fontWeight="bold">{currentPage}</Text>
            </Box>
            <Button 
              size="sm" 
              variant="outline" 
              isDisabled={currentPage === totalPages || totalPages === 0} 
              onPress={() => setCurrentPage(p => p + 1)}
              borderColor="$borderLight300"
            >
              <ButtonIcon as={ChevronRight} color="$textLight600" />
            </Button>
          </HStack>
        </HStack>
      </Box>
    </VStack>
  );
}
