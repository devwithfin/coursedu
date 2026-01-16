import { View, Text, StyleSheet } from 'react-native';
import WebNavbar from '../../../components/WebNavbar'; // Import WebNavbar

export default function AdminDashboardWeb() {
  return (
    <View style={styles.container}>
      <WebNavbar />
      <View style={styles.content}>
        <Text style={styles.title}>Admin Dashboard (Web)</Text>
        <Text>Welcome to the admin dashboard for web!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // Light blue background for admin web
  },
  content: {
    flex: 1, // Make content take remaining space
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00796b',
  },
});
