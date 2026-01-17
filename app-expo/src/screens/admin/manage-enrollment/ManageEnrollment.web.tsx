import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebNavbar from '../../../components/WebNavbar';

const ManageEnrollmentScreen = () => {
  return (
    <View style={styles.container}>
      <WebNavbar activeScreen="Manage Enrollment" />
      <View style={styles.content}>
        <Text style={styles.title}>Manage Enrollment</Text>
        <Text>This is the manage enrollment screen.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
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

export default ManageEnrollmentScreen;
