import { View, Text, StyleSheet } from 'react-native';

export default function CourcesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Courses</Text>
      <Text>Here you can view your enrolled courses.</Text>
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