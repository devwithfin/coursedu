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
  Pressable, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem, ChevronDownIcon
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { X, ChevronLeft, ChevronRight, Search, Edit, Trash } from 'lucide-react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

import { COLORS } from '../../constants/theme';
import { apiUrl } from '@/constants/api';

interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  status: 'active' | 'archived';
  start_date: string;
  end_date: string;
}

interface Teacher {
  id: number;
  name: string;
}

export default function AdminKelas() {
    const router = useRouter();
    const toast = useToast();

    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        teacher_id: '',
        status: 'active' as 'active' | 'archived',
        start_date: '',
        end_date: ''
    });

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coursesRes, teachersRes] = await Promise.all([
                axios.get(apiUrl('/api/courses')),
                axios.get(apiUrl('/api/users'))
            ]);
            
            setCourses(coursesRes.data);
            const teacherList = teachersRes.data.filter((u: any) => u.role === 'teacher');
            setTeachers(teacherList);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teachers.find(t => t.id === course.teacher_id)?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleOpenModal = (data: Course | null = null) => {
        if (data) {
            setIsEditing(true);
            setSelectedId(data.id);
            setCourseForm({ 
                title: data.title,
                description: data.description || '',
                teacher_id: data.teacher_id?.toString() || '',
                status: data.status,
                start_date: data.start_date ? data.start_date.substring(0, 10) : '',
                end_date: data.end_date ? data.end_date.substring(0, 10) : ''
            });
        } else {
            setIsEditing(false);
            setSelectedId(null);
            setCourseForm({ title: '', description: '', teacher_id: '', status: 'active', start_date: '', end_date: '' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (!courseForm.title || !courseForm.teacher_id) {
                toast.show({
                    placement: "top",
                    render: ({ id }) => <Toast nativeID={id} action="warning" variant="solid"><ToastTitle>Lengkapi Data</ToastTitle><ToastDescription>Judul dan Guru wajib diisi.</ToastDescription></Toast>
                });
                return;
            }

            const payload = {
                ...courseForm,
                teacher_id: parseInt(courseForm.teacher_id)
            };

            let url = isEditing ? apiUrl(`/api/courses/${selectedId}`) : apiUrl('/api/courses');
            let method = isEditing ? 'put' : 'post';

            const response = await axios({ method, url, data: payload });

            if (response.status === 200 || response.status === 201) {
                toast.show({
                    placement: "top",
                    render: ({ id }) => <Toast nativeID={id} action="success" variant="accent"><ToastTitle>Berhasil</ToastTitle><ToastDescription>Data kelas berhasil disimpan.</ToastDescription></Toast>
                });
                setShowModal(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error saving course:', error);
            toast.show({
                placement: "top",
                render: ({ id }) => <Toast nativeID={id} action="error" variant="solid"><ToastTitle>Gagal</ToastTitle><ToastDescription>Gagal menyimpan data kelas.</ToastDescription></Toast>
            });
        }
    };

    const handleDelete = (id: number) => {
        const performDelete = async () => {
            try {
                await axios.delete(apiUrl(`/api/courses/${id}`));
                toast.show({
                    placement: "top",
                    render: ({ id: toastId }) => <Toast nativeID={toastId} action="success" variant="accent"><ToastTitle>Dihapus</ToastTitle><ToastDescription>Data kelas telah dihapus.</ToastDescription></Toast>
                });
                fetchData();
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        };

        if(Platform.OS === 'web') {
            if(confirm('Yakin ingin menghapus kelas ini?')) performDelete();
        } else {
            Alert.alert('Hapus Kelas', 'Yakin ingin menghapus?', [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', style: 'destructive', onPress: performDelete }
            ]);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date, field: 'start_date' | 'end_date' = 'start_date') => {
        if (Platform.OS !== 'ios') {
            if (field === 'start_date') setShowStartPicker(false);
            else setShowEndPicker(false);
        }
        
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            setCourseForm({ ...courseForm, [field]: dateString });
        }
    };

    const renderCourseItem = ({ item }: { item: Course }) => (
        <HStack p="$4" borderBottomWidth={1} borderColor="$borderLight100" alignItems="center">
            <VStack w="$1/3">
                <Text fontWeight="bold" color="$textLight900">{item.title}</Text>
                <Text size="xs" color="$textLight500">{teachers.find(t => t.id === item.teacher_id)?.name || 'Tanpa Guru'}</Text>
            </VStack>
            <Box w="$1/4">
                <Badge action={item.status === 'active' ? 'success' : 'warning'} variant="outline" borderRadius="$full" w={80} justifyContent="center">
                    <BadgeText>{item.status.toUpperCase()}</BadgeText>
                </Badge>
            </Box>
            <Box w="$1/4">
                <Text size="xs" color="$textLight700">
                    {item.start_date ? new Date(item.start_date).toLocaleDateString() : '-'} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : '-'}
                </Text>
            </Box>
            <HStack flex={1} space="sm" justifyContent="flex-end">
                <Button size="xs" variant="outline" borderColor="$borderLight300" onPress={() => handleOpenModal(item)} w={36} h={36} p="$0" justifyContent="center" alignItems="center">
                    <ButtonIcon as={Edit} color="$textLight500" />
                </Button>
                <Button size="xs" variant="outline" borderColor="$red200" onPress={() => handleDelete(item.id)} w={36} h={36} p="$0" justifyContent="center" alignItems="center">
                    <ButtonIcon as={Trash} color="$red500" />
                </Button>
            </HStack>
        </HStack>
    );

    return (
        <VStack flex={1} bg="$backgroundLight100" p="$6">
            <HStack justifyContent="space-between" alignItems="center" mb="$6">
                <Heading size="xl">Manajemen Kelas</Heading>
                <HStack space="md" alignItems="center">
                    <Box w={250}>
                        <Input size="sm" bg="$white">
                            <InputSlot pl="$3">
                                <InputIcon as={Search} size="sm" />
                            </InputSlot>
                            <InputField 
                                placeholder="Cari kelas atau guru..." 
                                value={searchQuery}
                                onChangeText={(t) => {
                                    setSearchQuery(t);
                                    setCurrentPage(1);
                                }}
                            />
                        </Input>
                    </Box>
                    <Button bg={COLORS.primary} onPress={() => handleOpenModal()} size="sm">
                        <Ionicons name="add" color="white" size={16} />
                        <ButtonText ml="$2">Tambah Kelas</ButtonText>
                    </Button>
                </HStack>
            </HStack>

            <Box flex={1} bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" overflow="hidden">
                <HStack bg="$backgroundLight50" p="$4" borderBottomWidth={1} borderColor="$borderLight200">
                    <Text w="$1/3" fontWeight="$bold" color="$textLight600">JUDUL KELAS</Text>
                    <Text w="$1/4" fontWeight="$bold" color="$textLight600">STATUS</Text>
                    <Text w="$1/4" fontWeight="$bold" color="$textLight600">TANGGAL</Text>
                    <Text flex={1} fontWeight="$bold" color="$textLight600" textAlign="right">AKSI</Text>
                </HStack>
                
                <FlatList
                    data={paginatedCourses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCourseItem}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<Box p="$4" alignItems="center"><Text color="$textLight400">Tidak ada kelas ditemukan.</Text></Box>}
                />

                {/* Pagination Controls */}
                <HStack p="$4" justifyContent="space-between" alignItems="center" borderTopWidth={1} borderColor="$borderLight200" bg="$backgroundLight50">
                    <Text size="sm" color="$textLight500">
                        Menampilkan {filteredCourses.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredCourses.length)} dari {filteredCourses.length} kelas
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

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">{isEditing ? 'Edit Kelas' : 'Tambah Kelas Baru'}</Heading>
                        <ModalCloseButton><Icon as={X} /></ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <VStack space="md">
                            <FormControl isRequired>
                                <FormControlLabel><FormControlLabelText>Judul Kelas</FormControlLabelText></FormControlLabel>
                                <Input><InputField value={courseForm.title} onChangeText={(t) => setCourseForm({...courseForm, title: t})} placeholder="Contoh: Pemrograman Web" /></Input>
                            </FormControl>
                            
                            <FormControl>
                                <FormControlLabel><FormControlLabelText>Deskripsi</FormControlLabelText></FormControlLabel>
                                <Input><InputField value={courseForm.description} onChangeText={(t) => setCourseForm({...courseForm, description: t})} multiline numberOfLines={3} /></Input>
                            </FormControl>

                            <FormControl isRequired>
                                <FormControlLabel><FormControlLabelText>Guru Pengampu</FormControlLabelText></FormControlLabel>
                                <Select onValueChange={(v) => setCourseForm({...courseForm, teacher_id: v})} selectedValue={courseForm.teacher_id}>
                                    <SelectTrigger variant="outline" size="md">
                                        <SelectInput placeholder="Pilih Guru" />
                                        <SelectIcon mr="$3"><Icon as={ChevronDownIcon} /></SelectIcon>
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                                            {teachers.map(teacher => (
                                                <SelectItem key={teacher.id} label={teacher.name} value={teacher.id.toString()} />
                                            ))}
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            </FormControl>

                            <HStack space="md">
                                <FormControl flex={1}>
                                    <FormControlLabel><FormControlLabelText>Tgl Mulai</FormControlLabelText></FormControlLabel>
                                    {Platform.OS === 'web' ? (
                                        <Box h="$10" borderWidth={1} borderColor="$borderLight300" borderRadius="$sm" justifyContent="center" px="$3">
                                            <input 
                                                type="date" 
                                                value={courseForm.start_date} 
                                                onChange={(e) => setCourseForm({...courseForm, start_date: e.target.value})}
                                                style={{ border: 'none', outline: 'none', width: '100%', height: '100%', background: 'transparent', fontFamily: 'inherit', fontSize: '14px', color: '#1F2937' }}
                                            />
                                        </Box>
                                    ) : (
                                        <Pressable onPress={() => setShowStartPicker(true)}>
                                            <Input isReadOnly>
                                                <InputField value={courseForm.start_date} placeholder="YYYY-MM-DD" isReadOnly />
                                                <InputSlot pr="$3"><Ionicons name="calendar" size={16} color={COLORS.primary}/></InputSlot>
                                            </Input>
                                        </Pressable>
                                    )}
                                    {Platform.OS !== 'web' && showStartPicker && (
                                        <DateTimePicker
                                            value={courseForm.start_date ? new Date(courseForm.start_date) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(e, d) => onDateChange(e, d, 'start_date')}
                                        />
                                    )}
                                </FormControl>
                                <FormControl flex={1}>
                                    <FormControlLabel><FormControlLabelText>Tgl Selesai</FormControlLabelText></FormControlLabel>
                                    {Platform.OS === 'web' ? (
                                        <Box h="$10" borderWidth={1} borderColor="$borderLight300" borderRadius="$sm" justifyContent="center" px="$3">
                                            <input 
                                                type="date" 
                                                value={courseForm.end_date} 
                                                onChange={(e) => setCourseForm({...courseForm, end_date: e.target.value})}
                                                style={{ border: 'none', outline: 'none', width: '100%', height: '100%', background: 'transparent', fontFamily: 'inherit', fontSize: '14px', color: '#1F2937' }}
                                            />
                                        </Box>
                                    ) : (
                                        <Pressable onPress={() => setShowEndPicker(true)}>
                                            <Input isReadOnly>
                                                <InputField value={courseForm.end_date} placeholder="YYYY-MM-DD" isReadOnly />
                                                <InputSlot pr="$3"><Ionicons name="calendar" size={16} color={COLORS.primary}/></InputSlot>
                                            </Input>
                                        </Pressable>
                                    )}
                                    {Platform.OS !== 'web' && showEndPicker && (
                                        <DateTimePicker
                                            value={courseForm.end_date ? new Date(courseForm.end_date) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(e, d) => onDateChange(e, d, 'end_date')}
                                        />
                                    )}
                                </FormControl>
                            </HStack>

                            <FormControl>
                                <FormControlLabel><FormControlLabelText>Status</FormControlLabelText></FormControlLabel>
                                <Select onValueChange={(v: any) => setCourseForm({...courseForm, status: v})} selectedValue={courseForm.status}>
                                    <SelectTrigger variant="outline" size="md">
                                        <SelectInput />
                                        <SelectIcon mr="$3"><Icon as={ChevronDownIcon} /></SelectIcon>
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                                            <SelectItem label="Active" value="active" />
                                            <SelectItem label="Archived" value="archived" />
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            </FormControl>
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
