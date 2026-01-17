import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AcademyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Courses Screen</Text>
      <Text>This is the academy management screen.</Text>
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

export default AcademyScreen;
