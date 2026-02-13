import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { getSchedulesByCourseId } from '../../../api/schedule';
import { RootStackParamList } from '../../../types/navigation';

interface Schedule {
  id: number;
  session_topic: string;
  session_date: string;
  location: string;
}

interface MaterialDetails {
  id: number;
  title: string;
  content: string;
  uploaded_at: string;
  course: {
    title: string;
  };
}

type ScheduleListScreenRouteProp = RouteProp<RootStackParamList, 'ScheduleList'>;

const ScheduleListScreen = () => {
  const route = useRoute<ScheduleListScreenRouteProp>();
  const navigation = useNavigation();
  const { courseId, material } = route.params;

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const schedulesData = await getSchedulesByCourseId(courseId);
        setSchedules(schedulesData);
      } catch (err) {
        setError(err.message || 'Failed to fetch schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [courseId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <ScrollView style={styles.container}>
        {loading ? (
            <ActivityIndicator size="large" color="#083D7F" style={{ marginTop: 20 }} />
        ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
        ) : (
            <>
            {material && (
                <View style={styles.banner}>
                <Text style={styles.bannerTitle}>{material.title}</Text>
                <Text style={styles.bannerDescription}>{material.content}</Text>
                <Text style={styles.bannerTeacher}>Uploaded: {formatDate(material.uploaded_at)}</Text>
                </View>
            )}
            {schedules.length > 0 ? (
                schedules.map((schedule) => (
                <View key={schedule.id} style={styles.scheduleCard}>
                    <Text style={styles.sessionTopic}>{schedule.session_topic}</Text>
                    <Text style={styles.sessionDate}>{formatDate(schedule.session_date)}</Text>
                    <Text style={styles.location}>{schedule.location}</Text>
                </View>
                ))
            ) : (
                <Text style={styles.noSchedulesText}>No schedules found for this material course.</Text>
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
    bannerTeacher: { // Renamed from bannerCourse to be more generic for material details
        fontSize: 12,
        color: '#fff',
        marginTop: 10,
        fontStyle: 'italic',
    },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  sessionTopic: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  sessionDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 10,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noSchedulesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
  },
});

export default ScheduleListScreen;