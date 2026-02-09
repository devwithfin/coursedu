import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { getAllCourses } from '../../../api/course';
import { getEnrollments, createEnrollment } from '../../../api/enrollment';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Course {
  id: number;
  title: string;
  description: string;
  teacher: {
    name: string;
  };
}

interface Enrollment {
  id: number;
  course_id: number;
  is_approved: number;
}

const EnrollScreen = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentData = async () => {
    if (!user) {
        setLoading(false);
        return;
    }
    try {
        setLoading(true);
        const [fetchedCourses, fetchedEnrollments] = await Promise.all([
            getAllCourses(),
            getEnrollments(user.id, null, null, null), // Fetch all enrollments for the student
        ]);
        setCourses(fetchedCourses);
        setEnrollments(fetchedEnrollments);
        setError(null);
    } catch (err) {
        setError(err.message || 'Failed to fetch data');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollmentData();
  }, [user]);

  const handleEnroll = async (courseId: number) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to enroll.');
      return;
    }
    try {
      await createEnrollment(user.id, courseId);
      Alert.alert('Success', 'Enrollment request sent. Waiting for approval.');
      fetchEnrollmentData(); // Refresh data
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to enroll in course.');
    }
  };

  const getEnrollmentStatus = (courseId: number) => {
    const enrollment = enrollments.find(e => e.course_id === courseId);
    if (!enrollment) return 'Not Enrolled';
    if (enrollment.is_approved === 1) return 'Enrolled';
    return 'Pending';
  };

  const renderCourseCard = ({ item: course }: { item: Course }) => {
    const status = getEnrollmentStatus(course.id);
    const isEnrolled = status === 'Enrolled';
    const isPending = status === 'Pending';

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
          <Text style={styles.teacherName}>Teacher: {course.teacher.name}</Text>
          <Text style={[styles.statusText,
            isEnrolled ? styles.statusEnrolled : isPending ? styles.statusPending : styles.statusNotEnrolled
          ]}>Status: {status}</Text>
          {!isEnrolled && !isPending && (
            <TouchableOpacity style={styles.enrollButton} onPress={() => handleEnroll(course.id)}>
              <Text style={styles.enrollButtonText}>Enroll</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#083D7F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={courses}
      renderItem={renderCourseCard}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  cardContent: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  teacherName: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statusEnrolled: {
    color: 'green',
  },
  statusPending: {
    color: 'orange',
  },
  statusNotEnrolled: {
    color: 'gray',
  },
  enrollButton: {
    backgroundColor: '#083D7F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  enrollButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default EnrollScreen;
