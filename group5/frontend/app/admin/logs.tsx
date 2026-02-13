import React, { useState, useEffect } from 'react';
import { VStack, Text, Heading, Icon, Box, HStack, Button, ButtonIcon, ButtonText, Input, InputField, InputSlot, InputIcon } from '@gluestack-ui/themed';
import { FlatList, ActivityIndicator } from 'react-native';
import { FileText, ChevronLeft, ChevronRight, User, ArrowLeft, Search } from 'lucide-react-native';
import axios from 'axios';
import { COLORS } from '../../constants/theme';
import { apiUrl } from '@/constants/api';

interface UserData {
  id: number;
  name: string;
  role: string;
}

interface Log {
  id: number;
  activity: string;
  activity_time: string;
  User: {
    name: string;
  };
}

const UserCard = ({ user, onSelect }: { user: UserData, onSelect: (user: UserData) => void }) => {
  return (
    <HStack space="md" alignItems="center" p="$4" borderBottomWidth={1} borderColor="$borderLight200" justifyContent="space-between">
      <HStack space="md" alignItems="center">
        <Box bg="$backgroundLight100" p="$2" borderRadius="$full">
          <Icon as={User} color={COLORS.primary} size="md" />
        </Box>
        <VStack>
          <Text fontWeight="$bold" color="$textDark800">{user.name}</Text>
          <Text size="xs" color="$textLight500" textTransform="capitalize">{user.role}</Text>
        </VStack>
      </HStack>
      <Button size="sm" variant="outline" borderColor={COLORS.primary} onPress={() => onSelect(user)}>
        <ButtonText color={COLORS.primary} size="xs">Lihat Aktivitas</ButtonText>
      </Button>
    </HStack>
  );
};

const LogItem = ({ item }: { item: Log }) => {
  const formattedTime = new Date(item.activity_time).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <HStack space="md" alignItems="flex-start" p="$4" borderBottomWidth={1} borderColor="$borderLight200">
      <Box bg="$backgroundLight100" p="$2" borderRadius="$md">
          <Icon as={FileText} color={COLORS.primary} size="md" />
      </Box>
      <VStack flex={1}>
        <HStack justifyContent="space-between" alignItems="flex-start">
            <Text fontWeight="$bold" color="$textDark800" numberOfLines={2} flex={1} mr="$2">
            {item.activity}
            </Text>
            <Text size="xs" color="$textLight500" mt="$1">
            {formattedTime}
            </Text>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default function AdminLogs() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl('/api/users'));
      setUsers(response.data);
      setError(null);
    } catch (e) {
      setError('Gagal memuat daftar user.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLogs = async (userId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl(`/api/logs/${userId}`));
      setLogs(response.data);
      setCurrentPage(1);
      setError(null);
    } catch (e) {
      setError('Gagal memuat log aktivitas user.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    setSearchQuery('');
    fetchUserLogs(user.id);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setLogs([]);
    setSearchQuery('');
    setError(null);
  };

  const filteredData = (selectedUser ? logs : users).filter((item: any) => {
    if (selectedUser) {
      return (item as Log).activity.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return (item as UserData).name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             (item as UserData).role.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;
    }
    if (error) {
      return <Text color="$red500" textAlign="center" mt="$10">{error}</Text>;
    }
    
    return (
      <>
        <VStack bg="$backgroundLight50" borderBottomWidth={1} borderColor="$borderLight200">
          <HStack p="$4" alignItems="center" space="sm" justifyContent="space-between">
              <HStack flex={1} alignItems="center" space="sm">
                {selectedUser && (
                  <Button size="xs" variant="link" onPress={handleBack} p="$0">
                    <Icon as={ArrowLeft} color={COLORS.primary} mr="$1" />
                  </Button>
                )}
                <Text fontWeight="bold" color="$textLight600">
                  {selectedUser ? `AKTIVITAS: ${selectedUser.name.toUpperCase()}` : 'DAFTAR USER'}
                </Text>
              </HStack>

              <Box w="$1/3">
                <Input size="xs" bg="$white">
                  <InputSlot pl="$2">
                    <InputIcon as={Search} size="xs" />
                  </InputSlot>
                  <InputField 
                    placeholder="Cari..." 
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      setCurrentPage(1);
                    }}
                  />
                </Input>
              </Box>
          </HStack>
        </VStack>

        <FlatList
            data={paginatedData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              selectedUser ? <LogItem item={item as Log} /> : <UserCard user={item as UserData} onSelect={handleSelectUser} />
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <Box p="$4" alignItems="center">
                <Text color="$textLight400">
                  {selectedUser ? 'Tidak ada aktivitas log ditemukan.' : 'Tidak ada user ditemukan.'}
                </Text>
              </Box>
            }
        />

        {/* Pagination Controls */}
        <HStack p="$4" justifyContent="space-between" alignItems="center" borderTopWidth={1} borderColor="$borderLight200" bg="$backgroundLight50">
            <Text size="sm" color="$textLight500">
                Menampilkan {filteredData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} {selectedUser ? 'aktivitas' : 'user'}
            </Text>
            <HStack space="sm">
                <Button 
                    size="sm" 
                    variant="outline" 
                    isDisabled={currentPage === 1} 
                    onPress={handlePrevPage}
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
                    onPress={handleNextPage}
                    borderColor="$borderLight300"
                >
                    <ButtonIcon as={ChevronRight} color="$textLight600" />
                </Button>
            </HStack>
        </HStack>
      </>
    );
  };

  return (
    <VStack flex={1} bg="$backgroundLight100" p="$6">
      <Heading size="xl" mb="$6">Logs Aktivitas Sistem</Heading>

      <Box 
        flex={1} 
        bg="$white" 
        borderRadius="$xl" 
        borderWidth={1} 
        borderColor="$borderLight200" 
        overflow="hidden"
      >
        {renderContent()}
      </Box>
    </VStack>
  );
}
