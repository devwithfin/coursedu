import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Keep original import
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import { RootStackParamList } from '../types/navigation'; // Import RootStackParamList

export default function WebNavbar() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); // Explicitly type navigation

  return (
    <View style={styles.navbar}>
      <View style={styles.containerFluid}>
        <TouchableOpacity onPress={() => navigation.navigate('Admin', { screen: 'Dashboard' })}>
          <Text style={styles.navbarBrand}>Coursedu</Text>
        </TouchableOpacity>

        <View style={styles.navbarSupportedContent}>
          <View style={styles.navbarNav}>
            <TouchableOpacity onPress={() => console.log('Home clicked')}>
              <Text style={[styles.navLink, styles.activeNavLink]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Link clicked')}>
              <Text style={styles.navLink}>Link</Text>
            </TouchableOpacity>
            <Text style={styles.navLinkDisabled}>Dropdown</Text>
            <Text style={styles.navLinkDisabled}>Disabled</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#083D7F',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#083D7F',
    width: '100%',
  },
  containerFluid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navbarBrand: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  navbarSupportedContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  navbarNav: {
    flexDirection: 'row',
  },
  navLink: {
    color: '#F9FAFB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  activeNavLink: {
    color: '#F9FAFB',
    fontWeight: 'bold',
  },
  navLinkDisabled: {
    color: '#F9FAFB80',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});