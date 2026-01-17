import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

interface WebLayoutProps {
  children: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

export default function WebLayout({ children }: WebLayoutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Image
          source={require('../../assets/images/banner.jpg')}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.rightColumn}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: height, 
    backgroundColor: '#f9fafb', 
  },
  leftColumn: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  bannerImage: {
    width: '90%', 
    height: '90%', 
  },
  rightColumn: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb', 
  },
});
