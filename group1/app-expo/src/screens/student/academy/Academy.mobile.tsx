import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { getEnrollments } from '../../../api/enrollment';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import MaterialCommunityIcons

const blobImages = [
  require('../../../..//assets/images/blob1.png'),
  require('../../../..//assets/images/blob2.png'),
  require('../../../..//assets/images/blob3.png'),
  require('../../../..//assets/images/blob4.png'),
  require('../../../..//assets/images/blob5.png'),
  require('../../../..//assets/images/blob6.png'),
];

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

const AcademyScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch all enrollments without a limit
        const fetchedEnrollments = await getEnrollments(user.id, null, 'enrolled_at,DESC');
        setEnrollments(fetchedEnrollments);
        setFilteredEnrollments(fetchedEnrollments); // Initialize filtered list
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch enrollments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Debounce effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = enrollments.filter(enrollment =>
          enrollment.course.title.toLowerCase().includes(lowercasedSearchTerm) ||
          enrollment.course.teacher.name.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredEnrollments(filtered);
      } else {
        setFilteredEnrollments(enrollments);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, enrollments]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your course"
          placeholderTextColor="#666"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#083D7F" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        filteredEnrollments.map((enrollment, index) => (
          <TouchableOpacity 
            key={enrollment.id} 
            style={styles.card}
            onPress={() => navigation.navigate('Class', { courseId: enrollment.course.id, courseTitle: enrollment.course.title })}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
  },
  // Search Bar Styles
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25, // Rounded pill shape
    paddingHorizontal: 15,
    paddingVertical: 15, // Increased vertical padding
    marginHorizontal: 20,
    width: '90%', // Full width with some margin
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    alignSelf: 'center', // Center the search bar
    marginBottom: 20, // Add some margin below the search bar
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14, // Decreased font size
    color: '#333',
    paddingVertical: 0,
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
    alignSelf: 'center', // Center the card
  },
  cardImage: {
    width: '100%',
    height: 100, // Adjust height as needed
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default AcademyScreen;