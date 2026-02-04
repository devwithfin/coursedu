import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import WebNavbar from '../../../components/WebNavbar';
import { getAdminStats } from '../../../api/admin';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminDashboardWeb() {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    pendingApproval: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Dashboard.web.tsx: Component mounted or user/token changed.');
    console.log('Dashboard.web.tsx: Current user object:', user);
    console.log('Dashboard.web.tsx: User token:', user?.token ? 'Present' : 'Missing');

    const fetchStats = async () => {
      if (!user?.token) {
        console.log('Dashboard.web.tsx: User token missing, setting error.');
        setError('User not authenticated');
        setLoading(false);
        return;
      }
      console.log('Dashboard.web.tsx: Fetching stats with token...');
      try {
        const data = await getAdminStats(user.token);
        console.log('Dashboard.web.tsx: Data received from API:', data);
        setAdminStats(data);
      } catch (err) {
        setError('Failed to fetch admin statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.token]);

  const statsDisplay = [
    { label: 'Students', value: adminStats.students },
    { label: 'Teachers', value: adminStats.teachers },
    { label: 'Courses', value: adminStats.courses },
    { label: 'Pending Approval', value: adminStats.pendingApproval },
  ];

  return (
    <View style={styles.container}>
      <WebNavbar activeScreen="Dashboard" />

      <View style={styles.content}>
        <Text style={styles.title}>Admin Dashboard</Text>

        {loading && <ActivityIndicator size="large" color="#00796b" />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && !error && (
          <View style={styles.cardContainer}>
            {statsDisplay.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardValue}>{item.value}</Text>
                <Text style={styles.cardLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#00796b',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20, // works on web
  },
  card: {
    backgroundColor: '#ffffff',
    width: '22%',
    minWidth: 220,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
});
