import { View, Text, StyleSheet } from 'react-native';
import WebNavbar from '../../../components/WebNavbar';

export default function AdminDashboardWeb() {
  // Dummy data
  const stats = [
    { label: 'Students', value: 1240 },
    { label: 'Teachers', value: 85 },
    { label: 'Courses', value: 42 },
    { label: 'Pending Approval', value: 17 },
  ];

  return (
    <View style={styles.container}>
      <WebNavbar activeScreen="Dashboard" />

      <View style={styles.content}>
        <Text style={styles.title}>Admin Dashboard</Text>

        <View style={styles.cardContainer}>
          {stats.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
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
