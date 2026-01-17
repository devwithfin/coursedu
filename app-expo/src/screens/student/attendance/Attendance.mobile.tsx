import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AttendanceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Screen</Text>
      <Text>This is the attendance management screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AttendanceScreen;
