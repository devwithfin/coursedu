import { View, Text, StyleSheet } from 'react-native';

export default function EnrollScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enroll Screen (Mobile)</Text>
      <Text>This is the enroll screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
});
