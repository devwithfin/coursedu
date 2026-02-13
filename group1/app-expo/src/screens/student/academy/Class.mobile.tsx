import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { getMaterials } from '../../../api/material';
import { getCourseById } from '../../../api/course';
import { RootStackParamList } from '../../../types/navigation';

const blobImages = [
    require('../../../../assets/images/blob1.png'),
    require('../../../../assets/images/blob2.png'),
    require('../../../../assets/images/blob3.png'),
    require('../../../../assets/images/blob4.png'),
    require('../../../../assets/images/blob5.png'),
    require('../../../../assets/images/blob6.png'),
  ];
  
  interface Material {
    id: number;
    title: string;
    content: string;
    file_path?: string;
    uploaded_at: string;
    course: {
      title: string;
    };
  }

  interface Course {
    id: number;
    title: string;
    description: string;
    teacher: {
      name: string;
    };
  }
  
  type ClassScreenRouteProp = RouteProp<RootStackParamList, 'Class'>;
  
  const ClassScreen = () => {
    const route = useRoute<ClassScreenRouteProp>();
    const navigation = useNavigation();
    const { courseId } = route.params;
  
    const [course, setCourse] = useState<Course | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          console.log('Fetching course and materials for courseId:', courseId);
          const [courseData, materialsData] = await Promise.all([
            getCourseById(courseId),
            getMaterials([courseId]),
          ]);
          console.log('Fetched Course Data:', courseData);
          console.log('Fetched Materials Data:', materialsData);
          setCourse(courseData);
          setMaterials(materialsData);
          setError(null);
        } catch (err) {
          console.error('Error fetching data in ClassScreen:', err);
          setError(err.message || 'Failed to fetch data');
        } finally {
          console.log('Finished fetching data in ClassScreen, loading:', loading);
          setLoading(false);
        }
      };
  
      fetchData();
    }, [courseId]);
  
    console.log('ClassScreen State - Loading:', loading, 'Error:', error, 'Course:', course);  
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };
  
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#083D7F" style={{ marginTop: 20 }}/>
        ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {course && (
              <View style={styles.banner}>
                <Text style={styles.bannerTitle}>{course.title}</Text>
                <Text style={styles.bannerDescription}>{course.description}</Text>
                <Text style={styles.bannerTeacher}>Teacher: {course.teacher.name}</Text>
              </View>
            )}
            {materials.length > 0 ? (
              materials.map((material, index) => (
                <TouchableOpacity key={material.id} style={styles.materialCard} onPress={() => navigation.navigate('ScheduleList', { courseId: courseId, material: material })}>
                  <Image source={blobImages[index % blobImages.length]} style={styles.materialImage} />
                  <View style={styles.materialContent}>
                      <View style={styles.materialLeftContent}>
                          <Text style={styles.materialTitle}>{material.title}</Text>
                          <Text style={styles.materialCourse}>{material.course.title}</Text>
                      </View>
                      <Text style={styles.uploadedAt}>{formatDate(material.uploaded_at)}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noMaterialsText}>No materials found for this course.</Text>
            )}
          </>
        )}
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    banner: {
        backgroundColor: '#083D7F',
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    bannerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    bannerDescription: {
        fontSize: 14,
        color: '#fff',
        marginTop: 10,
    },
    bannerTeacher: {
        fontSize: 12,
        color: '#fff',
        marginTop: 10,
        fontStyle: 'italic',
    },
    materialCard: {
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      marginHorizontal: 20,
      marginBottom: 10, // Reduced margin
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
      height: 100, // Fixed height for smaller cards
      flexDirection: 'row', // Arrange image and content in a row
      alignItems: 'center', // Center items vertically
      overflow: 'hidden',
    },
    materialImage: {
      width: 100, // Fixed width for the image
      height: '100%', // Take full height of the card
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8, // Rounded only on the left
      borderTopRightRadius: 0, // No rounding on the right
      borderBottomRightRadius: 0, // No rounding on the right
      resizeMode: 'cover',
    },
    materialContent: {
      padding: 10,
      flex: 1, // Take remaining space
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    materialLeftContent: {
      flex: 1,
      marginRight: 10,
    },
    materialTitle: {
      fontSize: 14, // Slightly smaller font
      fontWeight: 'bold',
      color: '#111827',
    },
    materialCourse: {
      fontSize: 12, // Slightly smaller font
      color: '#6B7280',
      marginTop: 5,
    },
    uploadedAt: {
      fontSize: 10,
      color: '#A0AEC0',
      marginTop: 5,
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
    },
    noMaterialsText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: '#6B7280',
    },
  });
  
  export default ClassScreen;
