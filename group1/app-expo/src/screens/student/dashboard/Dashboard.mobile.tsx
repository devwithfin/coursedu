import { View, Text, StyleSheet, TextInput, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getTeachers } from '../../../api/user';
import { getEnrollments } from '../../../api/enrollment';
import { getMaterials } from '../../../api/material'; // Import getMaterials
import { useAuth } from '../../../contexts/AuthContext';

const blobImages = [
  require('../../../../assets/images/blob1.png'),
  require('../../../../assets/images/blob2.png'),
  require('../../../../assets/images/blob3.png'),
  require('../../../../assets/images/blob4.png'),
  require('../../../../assets/images/blob5.png'),
  require('../../../../assets/images/blob6.png'),
];

interface Teacher {
  id: string;
  name: string;
}

interface Enrollment {
  id: number;
  course: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    teacher: {
      name: string;
    };
  };
}

interface Material {
  id: number;
  title: string;
  content: string; // Assuming content is a string
  file_path?: string; // Optional file path
  uploaded_at: string;
  course: {
    id: number;
    title: string;
  };
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]); // New state for materials
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(true); // New loading state for materials
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoadingTeachers(false);
        setLoadingEnrollments(false);
        setLoadingMaterials(false);
        return;
      }
      try {
        // Fetch teachers
        setLoadingTeachers(true);
        const fetchedTeachers = await getTeachers(10, 'name,ASC');
        setTeachers(fetchedTeachers);
        
        // Fetch enrollments
        setLoadingEnrollments(true);
        const fetchedEnrollments = await getEnrollments(user.id, 3, 'enrolled_at,DESC');
        setEnrollments(fetchedEnrollments);

        // Extract course IDs from enrollments
        const courseIds = fetchedEnrollments.map(enrollment => enrollment.course.id);

        // Fetch materials based on course IDs
        setLoadingMaterials(true);
        if (courseIds.length > 0) {
          const fetchedMaterials = await getMaterials(courseIds, 5, 'uploaded_at,DESC');
          setMaterials(fetchedMaterials);
        } else {
          setMaterials([]); // No enrollments, no materials
        }

        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoadingTeachers(false);
        setLoadingEnrollments(false);
        setLoadingMaterials(false);
      }
    };

    fetchData();
  }, [user]);

  const renderTeacher = ({ item }: { item: Teacher }) => (
    <View style={styles.circularTeacherCard}>
      <MaterialCommunityIcons name="account-circle" size={60} color="#083D7F" />
      <Text style={styles.circularTeacherName}>{item.name}</Text>
    </View>
  );
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Academy Section Header */}
      <View style={styles.academyHeader}>
        <Text style={styles.sectionTitle}>Courses</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Academy')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Enrolled Courses */}
      {loadingEnrollments ? (
        <ActivityIndicator size="large" color="#083D7F" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        enrollments.map((enrollment, index) => (
          <TouchableOpacity
            key={enrollment.id}
            style={styles.card}
            onPress={() => navigation.navigate('Academy', { screen: 'Class', params: { courseId: enrollment.course.id, courseTitle: enrollment.course.title } })}
          >
            <Image source={blobImages[index % blobImages.length]} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.overlay} />
              <View style={styles.cardLeftContent}>
                <Text style={styles.courseTitle}>{enrollment.course.title}</Text>
                <Text style={styles.teacherName}>{enrollment.course.teacher.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* Teachers Section Header */}
      <View style={styles.teachersHeader}>
        <Text style={styles.teachersTitle}>Teachers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Academy')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Teachers List */}
      <View>
        {loadingTeachers ? (
          <ActivityIndicator size="large" color="#083D7F" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            horizontal
            data={teachers}
            renderItem={renderTeacher}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.circularTeachersScrollView}
          />
        )}
      </View>

      {/* Latest Material Section Header */}
      <View style={styles.latestMaterialHeader}>
        <Text style={styles.latestMaterialTitleHeader}>Latest Material</Text>
      </View>

      {/* Latest Material Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.latestMaterialScrollView}>
        {loadingMaterials ? (
            <ActivityIndicator size="large" color="#083D7F" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            materials.map((material, index) => (
              <TouchableOpacity 
                key={material.id} 
                style={styles.latestMaterialCard}
                onPress={() => navigation.navigate('Academy', { screen: 'Class', params: { courseId: material.course.id } })}
              >
                <Image source={blobImages[index % blobImages.length]} style={styles.latestMaterialImage} />
                <Text style={styles.latestMaterialCardTitle}>{material.title}</Text>
                <Text style={styles.latestMaterialCardContentTitle}>{material.course.title}</Text>
              </TouchableOpacity>
            ))
          )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 30,
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#083D7F',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginHorizontal: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    alignSelf: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },
  academyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#083D7F',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 20,
    marginBottom: 10,
    width: '90%',
    height: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
    overflow: 'hidden', // Clip image corners
  },
  cardImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cardLeftContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  teacherName: {
    fontSize: 14,
    color: '#F9FAFB',
  },
  dateRange: {
    fontSize: 10,
    color: '#F9FAFB',
    textAlign: 'right',
  },
  teachersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  teachersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  circularTeachersScrollView: {
    paddingLeft: 20,
    marginTop: 10,
  },
  circularTeacherImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  circularTeacherCard: {
    marginRight: 16,
  },
  circularTeacherName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  latestMaterialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 15,
  },
  latestMaterialTitleHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  latestMaterialScrollView: {
    paddingLeft: 20,
    marginTop: 10,
  },
  latestMaterialCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#fff', // Reverted to white
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  latestMaterialImage: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
    borderRadius: 4,
    marginBottom: 10,
  },
  latestMaterialCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#083D7F', // Reverted to original blue
    marginBottom: 5,
  },
  latestMaterialCardContentTitle: {
    fontSize: 12,
    color: '#666', // Reverted to original gray
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
