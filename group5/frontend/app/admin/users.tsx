import React, { useState, useEffect } from 'react';
import { ScrollView, Platform, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Box, VStack, HStack, Text, Heading, Icon,
  Avatar, AvatarFallbackText,
  Input, InputField, InputSlot, InputIcon,
  Button, ButtonText, ButtonIcon,
  Divider, Badge, BadgeText,
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  FormControl, FormControlLabel, FormControlLabelText,
  Toast, ToastTitle, ToastDescription, useToast,
  Pressable
} from '@gluestack-ui/themed';
import {
  Edit, Trash, Plus, X, ChevronLeft, ChevronRight, Search
} from 'lucide-react-native';

import { COLORS } from '../../constants/theme';
import { apiUrl } from '@/constants/api';

export default function AdminUsers() {
    const router = useRouter();
    const toast = useToast();

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [userForm, setUserForm] = useState({ name: '', role: 'Student', email: '', status: 'Active' });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl('/api/users'));
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                console.error('Failed to fetch users:', data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleOpenModal = (data: any = null) => {
        if (data) {
            setIsEditing(true);
            setSelectedId(data.id);
            setUserForm({ ...data });
        } else {
            setIsEditing(false);
            setSelectedId(null);
            setUserForm({ name: '', role: 'Student', email: '', status: 'Active' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            let url = isEditing ? apiUrl(`/api/users/${selectedId}`) : apiUrl('/api/users');
            let method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userForm),
            });

            if (response.ok) {
                toast.show({
                    placement: "top",
                    render: ({ id }) => <Toast nativeID={id} action="success" variant="accent"><ToastTitle>Data User Berhasil Disimpan</ToastTitle></Toast>
                });
                setShowModal(false);
                fetchUsers();
            } else {
                const errorData = await response.json();
                toast.show({
                    placement: "top",
                    render: ({ id }) => <Toast nativeID={id} action="error" variant="solid"><ToastTitle>Gagal Menyimpan Data User</ToastTitle><ToastDescription>{errorData.message || 'Terjadi kesalahan'}</ToastDescription></Toast>
                });
            }
        } catch (error) {
            console.error('Error saving user data:', error);
            toast.show({
                placement: "top",
                render: ({ id }) => <Toast nativeID={id} action="error" variant="solid"><ToastTitle>Gagal Menyimpan Data User</ToastTitle><ToastDescription>Tidak dapat terhubung ke server.</ToastDescription></Toast>
            });
        }
    };

    const handleDelete = async (id: number) => {
        const performDelete = async () => {
            try {
                const url = apiUrl(`/api/users/${id}`);
                const response = await fetch(url, { method: 'DELETE' });

                if (response.ok) {
                    toast.show({
                        placement: "top",
                        render: ({ id: toastId }) => <Toast nativeID={toastId} action="success" variant="accent"><ToastTitle>Data User Berhasil Dihapus</ToastTitle></Toast>
                    });
                    fetchUsers();
                } else {
                    const errorData = await response.json();
                    toast.show({
                        placement: "top",
                        render: ({ id: toastId }) => <Toast nativeID={toastId} action="error" variant="solid"><ToastTitle>Gagal Menghapus Data User</ToastTitle><ToastDescription>{errorData.message || 'Terjadi kesalahan'}</ToastDescription></Toast>
                    });
                }
            } catch (error) {
                console.error('Error deleting user data:', error);
                toast.show({
                    placement: "top",
                    render: ({ id: toastId }) => <Toast nativeID={toastId} action="error" variant="solid"><ToastTitle>Gagal Menghapus Data User</ToastTitle><ToastDescription>Tidak dapat terhubung ke server.</ToastDescription></Toast>
                });
            }
        };

        if(Platform.OS === 'web') {
            if(confirm('Yakin ingin menghapus data ini?')) {
                performDelete();
            }
        } else {
            Alert.alert('Hapus Data', 'Yakin ingin menghapus?', [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', style: 'destructive', onPress: performDelete }
            ]);
        }
    };

    const ActionButtons = ({ onEdit, onDelete }: any) => (
        <HStack space="sm" justifyContent="flex-end">
            <Button size="xs" variant="outline" borderColor="$borderLight300" onPress={onEdit} w={36} h={36} p="$0" justifyContent="center" alignItems="center">
                <ButtonIcon as={Edit} color="$textLight500" />
            </Button>
            <Button size="xs" variant="outline" borderColor="$red200" onPress={onDelete} w={36} h={36} p="$0" justifyContent="center" alignItems="center">
                <ButtonIcon as={Trash} color="$red500" />
            </Button>
        </HStack>
    );

    const renderUserItem = ({ item }: { item: any }) => (
        <HStack p="$4" borderBottomWidth={1} borderColor="$borderLight100" alignItems="center">
            <HStack w="$1/4" alignItems="center">
                <Avatar bg={COLORS.primary} size="sm" mr="$3"><AvatarFallbackText>{item.name}</AvatarFallbackText></Avatar>
                <VStack>
                    <Text fontWeight="bold" color="$textLight900">{item.name}</Text>
                </VStack>
            </HStack>
            <Text w="$1/4" color="$textLight700">{item.role}</Text>
            <Text w="$1/4" color="$textLight500" size="sm">{item.email}</Text>
            <Box w="$1/6" alignItems="flex-start">
                <Badge bg={item.status === 'active' ? '$green100' : '$red100'} size="md" variant="solid" borderRadius="$sm" alignSelf="flex-start">
                    <BadgeText color={item.status === 'active' ? '$green700' : '$red700'}>{item.status ? item.status.toUpperCase() : 'UNKNOWN'}</BadgeText>
                </Badge>
            </Box>
            <Box flex={1}><ActionButtons onEdit={() => handleOpenModal(item)} onDelete={() => handleDelete(item.id)} /></Box>
        </HStack>
    );

    return (
        <VStack flex={1} bg="$backgroundLight100" p="$6">
            <HStack justifyContent="space-between" alignItems="center" mb="$6">
                <Heading size="xl">Manajemen User</Heading>
                <HStack space="md" alignItems="center">
                    <Box w={250}>
                        <Input size="sm" bg="$white">
                            <InputSlot pl="$3">
                                <InputIcon as={Search} size="sm" />
                            </InputSlot>
                            <InputField 
                                placeholder="Cari nama, role, atau email..." 
                                value={searchQuery}
                                onChangeText={(t) => {
                                    setSearchQuery(t);
                                    setCurrentPage(1);
                                }}
                            />
                        </Input>
                    </Box>
                    <Button bg={COLORS.primary} onPress={() => handleOpenModal()} size="sm">
                        <ButtonIcon as={Plus} color="white" mr="$2" />
                        <ButtonText>Tambah User</ButtonText>
                    </Button>
                </HStack>
            </HStack>

            <Box flex={1} bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" overflow="hidden">
                <HStack bg="$backgroundLight50" p="$4" borderBottomWidth={1} borderColor="$borderLight200">
                    <Text w="$1/4" fontWeight="$bold" color="$textLight600">NAMA</Text>
                    <Text w="$1/4" fontWeight="$bold" color="$textLight600">ROLE</Text>
                    <Text w="$1/4" fontWeight="$bold" color="$textLight600">EMAIL</Text>
                    <Text w="$1/6" fontWeight="$bold" color="$textLight600">STATUS</Text>
                    <Text flex={1} fontWeight="$bold" color="$textLight600" textAlign="right">AKSI</Text>
                </HStack>

                <FlatList
                    data={paginatedUsers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderUserItem}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<Box p="$4" alignItems="center"><Text color="$textLight400">Tidak ada user ditemukan.</Text></Box>}
                />

                {/* Pagination Controls */}
                <HStack p="$4" justifyContent="space-between" alignItems="center" borderTopWidth={1} borderColor="$borderLight200" bg="$backgroundLight50">
                    <Text size="sm" color="$textLight500">
                        Menampilkan {filteredUsers.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} dari {filteredUsers.length} user
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
            </Box>

            {/* === MODAL FORM === */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">{isEditing ? 'Edit Data User' : 'Tambah User Baru'}</Heading>
                        <ModalCloseButton><Icon as={X} /></ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <VStack space="md">
                            <FormControl><FormControlLabel><FormControlLabelText>Nama Lengkap</FormControlLabelText></FormControlLabel><Input><InputField value={userForm.name} onChangeText={(t) => setUserForm({...userForm, name: t})} /></Input></FormControl>
                            <FormControl><FormControlLabel><FormControlLabelText>Email</FormControlLabelText></FormControlLabel><Input><InputField value={userForm.email} onChangeText={(t) => setUserForm({...userForm, email: t})} /></Input></FormControl>
                            <FormControl><FormControlLabel><FormControlLabelText>Role</FormControlLabelText></FormControlLabel><Input><InputField value={userForm.role} onChangeText={(t) => setUserForm({...userForm, role: t})} placeholder="Student/Teacher" /></Input></FormControl>
                            <FormControl><FormControlLabel><FormControlLabelText>Status</FormControlLabelText></FormControlLabel><Input><InputField value={userForm.status} onChangeText={(t) => setUserForm({...userForm, status: t})} placeholder="Active/Inactive" /></Input></FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" action="secondary" mr="$3" onPress={() => setShowModal(false)}><ButtonText>Batal</ButtonText></Button>
                        <Button action="primary" onPress={handleSave} bg={COLORS.primary}><ButtonText>Simpan</ButtonText></Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
