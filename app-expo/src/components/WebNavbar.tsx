import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons

interface WebNavbarProps {
  activeScreen?: 'Dashboard' | 'Manage Member' | 'Manage Academy' | 'Manage Enrollment';
}

export default function WebNavbar({ activeScreen }: WebNavbarProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.containerFluid}>
        <TouchableOpacity onPress={() => navigation.navigate('Admin', { screen: 'Dashboard' })}>
          <Text style={styles.navbarBrand}>Coursedu</Text>
        </TouchableOpacity>

        <View style={styles.centeredNav}>
          <View style={styles.navbarNav}>
            <TouchableOpacity onPress={() => navigation.navigate('Admin', { screen: 'Dashboard' })}>
              <Text style={[styles.navLink, activeScreen === 'Dashboard' && styles.activeNavLink]}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Admin', { screen: 'Manage Member' })}>
              <Text style={[styles.navLink, activeScreen === 'Manage Member' && styles.activeNavLink]}>Member</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Admin', { screen: 'Manage Academy' })}>
              <Text style={[styles.navLink, activeScreen === 'Manage Academy' && styles.activeNavLink]}>Academy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Admin', { screen: 'Manage Enrollment' })}>
              <Text style={[styles.navLink, activeScreen === 'Manage Enrollment' && styles.activeNavLink]}>Enrollment</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#F9FAFB" />
        </TouchableOpacity>
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
  centeredNav: {
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
  logoutButton: {
    backgroundColor: '#E53E3E',
    padding: 8, // Adjusted padding for icon
    borderRadius: 6,
    justifyContent: 'center', // Center icon vertically
    alignItems: 'center', // Center icon horizontally
  },
});