import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, ScrollView } from 'react-native';
import {
  Box, VStack, HStack, Text, Heading, 
  Badge, BadgeText, Divider, Button, ButtonIcon, ButtonText,
  Input, InputField, InputSlot, InputIcon,
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Icon
} from '@gluestack-ui/themed';
import { ChevronLeft, ChevronRight, Search, X, Award } from 'lucide-react-native';
import axios from 'axios';
import { COLORS } from '../../constants/theme';
import { apiUrl } from '@/constants/api';

interface ClassAvg {
  course_title: string;
  class_avg: number;
}

interface StudentGrade {
  student_id: number;
  student_name: string;
  course_title: string;
  average_score: number;
}

export default function GradeSummaryPage() {
  const [classAverages, setClassAverages] = useState<ClassAvg[]>([]);
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);

  // Search states
  const [classSearch, setClassSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // Pagination states
  const [classPage, setClassPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{name: string, grades: StudentGrade[]} | null>(null);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl('/api/manager/grade-summary'));
      setClassAverages(response.data.classAverages || []);
      setStudentGrades(response.data.studentGrades || []);
    } catch (error) {
      console.error('Error fetching grade summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // Filter logic for Classes
  const filteredClasses = classAverages.filter(item => 
    item.course_title.toLowerCase().includes(classSearch.toLowerCase())
  );

  // Grouping students for Section 2
  const uniqueStudents = Array.from(new Set(studentGrades.map(s => s.student_name)))
    .map(name => {
      const studentData = studentGrades.find(s => s.student_name === name);
      return {
        id: studentData?.student_id,
        name: name,
        email: `student@lms.test` // Placeholder if email not in student_scores
      };
    });

  const filteredStudents = uniqueStudents.filter(student => 
    student.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Pagination logic
  const classTotalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (classPage - 1) * itemsPerPage,
    classPage * itemsPerPage
  );

  const studentTotalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (studentPage - 1) * itemsPerPage,
    studentPage * itemsPerPage
  );

  const handleShowDetail = (studentName: string) => {
    const grades = studentGrades.filter(g => g.student_name === studentName);
    setSelectedStudent({ name: studentName, grades });
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundLight100">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </Box>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <VStack p="$6" space="xl">
        <Heading size="xl" mb="$2">Nilai</Heading>

        {/* --- SECTION 1: RATA-RATA PER KELAS --- */}
        <VStack space="md">
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="md" color="$textLight600">Ringkasan Nilai Per Kelas</Heading>
            <Box w={250}>
              <Input size="xs" bg="$white">
                <InputSlot pl="$3">
                  <InputIcon as={Search} size="xs" />
                </InputSlot>
                <InputField 
                  placeholder="Cari kelas..." 
                  value={classSearch}
                  onChangeText={(t) => {
                    setClassSearch(t);
                    setClassPage(1);
                  }}
                />
              </Input>
            </Box>
          </HStack>
          
          <Box bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" overflow="hidden">
            <HStack bg="$backgroundLight50" p="$4" borderBottomWidth={1} borderColor="$borderLight200">
              <Text flex={2} fontWeight="$bold" color="$textLight600">NAMA KELAS</Text>
              <Text flex={1} fontWeight="$bold" color="$textLight600" textAlign="right">RATA-RATA</Text>
            </HStack>
            
            <FlatList
              data={paginatedClasses}
              keyExtractor={(_, index) => `class-${index}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <HStack p="$4" borderBottomWidth={1} borderColor="$borderLight100">
                  <Text flex={2} fontWeight="bold">{item.course_title}</Text>
                  <Box flex={1} alignItems="flex-end">
                    <Badge action={item.class_avg >= 75 ? "success" : "warning"} variant="solid" borderRadius="$sm">
                      <BadgeText>{Number(item.class_avg).toFixed(2)}</BadgeText>
                    </Badge>
                  </Box>
                </HStack>
              )}
              ListEmptyComponent={<Box p="$4" alignItems="center"><Text color="$textLight400">Tidak ada data kelas ditemukan.</Text></Box>}
            />

            <HStack p="$4" justifyContent="space-between" alignItems="center" borderTopWidth={1} borderColor="$borderLight200" bg="$backgroundLight50">
              <Text size="xs" color="$textLight500">
                Menampilkan {filteredClasses.length > 0 ? ((classPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(classPage * itemsPerPage, filteredClasses.length)} dari {filteredClasses.length} kelas
              </Text>
              <HStack space="sm">
                <Button size="xs" variant="outline" isDisabled={classPage === 1} onPress={() => setClassPage(p => p - 1)} borderColor="$borderLight300">
                  <ButtonIcon as={ChevronLeft} color="$textLight600" />
                </Button>
                <Box bg="white" px="$2" py="$1" borderWidth={1} borderColor="$borderLight300" borderRadius="$sm">
                    <Text size="xs" fontWeight="bold">{classPage}</Text>
                </Box>
                <Button size="xs" variant="outline" isDisabled={classPage === classTotalPages || classTotalPages === 0} onPress={() => setClassPage(p => p + 1)} borderColor="$borderLight300">
                  <ButtonIcon as={ChevronRight} color="$textLight600" />
                </Button>
              </HStack>
            </HStack>
          </Box>
        </VStack>

        <Divider my="$4" />

        {/* --- SECTION 2: DAFTAR PESERTA (GROUPED) --- */}
        <VStack space="md">
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="md" color="$textLight600">Detail Nilai Peserta</Heading>
            <Box w={250}>
              <Input size="xs" bg="$white">
                <InputSlot pl="$3">
                  <InputIcon as={Search} size="xs" />
                </InputSlot>
                <InputField 
                  placeholder="Cari murid..." 
                  value={studentSearch}
                  onChangeText={(t) => {
                    setStudentSearch(t);
                    setStudentPage(1);
                  }}
                />
              </Input>
            </Box>
          </HStack>

          <Box bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" overflow="hidden">
            <HStack bg="$backgroundLight50" p="$4" borderBottomWidth={1} borderColor="$borderLight200">
              <Text flex={1} fontWeight="$bold" color="$textLight600">NAMA STUDENT</Text>
              <Text flex={1} fontWeight="$bold" color="$textLight600" textAlign="right">AKSI</Text>
            </HStack>
            
            <FlatList
              data={paginatedStudents}
              keyExtractor={(_, index) => `student-${index}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <HStack p="$4" borderBottomWidth={1} borderColor="$borderLight100" alignItems="center" justifyContent="space-between">
                  <Text flex={1} fontWeight="$semibold">{item.name}</Text>
                  <Button size="xs" variant="outline" borderColor={COLORS.primary} onPress={() => handleShowDetail(item.name)}>
                    <ButtonText color={COLORS.primary} size="xs">Lihat Nilai</ButtonText>
                  </Button>
                </HStack>
              )}
              ListEmptyComponent={<Box p="$4" alignItems="center"><Text color="$textLight400">Tidak ada murid ditemukan.</Text></Box>}
            />

            <HStack p="$4" justifyContent="space-between" alignItems="center" borderTopWidth={1} borderColor="$borderLight200" bg="$backgroundLight50">
              <Text size="xs" color="$textLight500">
                Menampilkan {filteredStudents.length > 0 ? ((studentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(studentPage * itemsPerPage, filteredStudents.length)} dari {filteredStudents.length} murid
              </Text>
              <HStack space="sm">
                <Button size="xs" variant="outline" isDisabled={studentPage === 1} onPress={() => setStudentPage(p => p - 1)} borderColor="$borderLight300">
                  <ButtonIcon as={ChevronLeft} color="$textLight600" />
                </Button>
                <Box bg="white" px="$2" py="$1" borderWidth={1} borderColor="$borderLight300" borderRadius="$sm">
                    <Text size="xs" fontWeight="bold">{studentPage}</Text>
                </Box>
                <Button size="xs" variant="outline" isDisabled={studentPage === studentTotalPages || studentTotalPages === 0} onPress={() => setStudentPage(p => p + 1)} borderColor="$borderLight300">
                  <ButtonIcon as={ChevronRight} color="$textLight600" />
                </Button>
              </HStack>
            </HStack>
          </Box>
        </VStack>
      </VStack>

      {/* --- MODAL DETAIL NILAI --- */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} size="lg">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader borderBottomWidth={1} borderColor="$borderLight100">
            <VStack>
              <Heading size="md">Detail Nilai</Heading>
              <Text size="sm" color="$textLight500">{selectedStudent?.name}</Text>
            </VStack>
            <ModalCloseButton><Icon as={X} /></ModalCloseButton>
          </ModalHeader>
          <ModalBody p="$0">
            <VStack>
              {selectedStudent?.grades.map((grade, index) => (
                <HStack key={index} p="$4" borderBottomWidth={index === selectedStudent.grades.length - 1 ? 0 : 1} borderColor="$borderLight100" justifyContent="space-between" alignItems="center">
                  <HStack space="md" alignItems="center" flex={1}>
                    <Box bg="$backgroundLight100" p="$2" borderRadius="$md">
                      <Icon as={Award} color={COLORS.primary} size="sm" />
                    </Box>
                    <Text fontWeight="$medium" size="sm" flex={1}>{grade.course_title}</Text>
                  </HStack>
                  <Box>
                    <Badge action={grade.average_score >= 75 ? "success" : "warning"} variant="solid" borderRadius="$full">
                      <BadgeText>{Number(grade.average_score).toFixed(1)}</BadgeText>
                    </Badge>
                  </Box>
                </HStack>
              ))}
              {selectedStudent?.grades.length === 0 && (
                <Box p="$10" alignItems="center">
                  <Text color="$textLight400">Belum ada data nilai.</Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
}
