import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebNavbar from '../../../components/WebNavbar';

const ManageAcademyScreen = () => {
  return (
    <View style={styles.container}>
      <WebNavbar activeScreen="Manage Academy" />
      <View style={styles.content}>
        <Text style={styles.title}>Manage Academy</Text>
        <Text>This is the manage academy screen.</Text>
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

export default ManageAcademyScreen;
