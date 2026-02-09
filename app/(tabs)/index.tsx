import * as Linking from 'expo-linking';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type GroupCard = {
  name: string;
  accent: string;
  features: string[];
  frontend: string;
  backend: string;
};

const groups: GroupCard[] = [
  {
    accent: '#fca5a5',
    name: 'Group 1',
    features: ['Enroll courses', 'Manage users & course catalogs'],
    frontend: 'http://localhost:8081',
    backend: 'http://localhost:3000',
  },
  {
    accent: '#facc15',
    name: 'Group 2',
    features: ['Manage assignments & instructors', 'Track task progress'],
    frontend: 'http://localhost:8082',
    backend: 'http://localhost:3001',
  },
  {
    accent: '#a5b4fc',
    name: 'Group 3',
    features: ['Manage quizzes & score reports'],
    frontend: 'http://localhost:8083',
    backend: 'http://localhost:3002',
  },
  {
    accent: '#f97316',
    name: 'Group 4',
    features: ['Discussion groups', 'Manage materials', 'Instructor schedules'],
    frontend: 'http://localhost:8084',
    backend: 'http://localhost:3003',
  },
  {
    accent: '#34d399',
    name: 'Group 5',
    features: ['Management reports'],
    frontend: 'http://localhost:8085',
    backend: 'http://localhost:3004',
  },
];

const openExternal = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch {
    // ignore
  }
};

export default function HomeScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          <Text style={styles.heroTitleAccent}>Coursedu</Text> (Learning Management System) | Informatics Management 18431
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {groups.map(group => (
          <Pressable
            key={group.name}
            style={[styles.card, { backgroundColor: group.accent }]}
            onPress={() => openExternal(group.frontend)}
          >
            <Text style={styles.cardTitle}>{group.name}</Text>
            <View style={styles.features}>
              {group.features.map(feature => (
                <Text key={feature} style={styles.featureItem}>
                  • {feature}
                </Text>
              ))}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 20,
  },
  hero: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  heroTitle: {
    textAlign: 'center',
    color: '#0f172a',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  heroTitleAccent: {
    color: '#1d4ed8',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    width: 250,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  features: {
    gap: 4,
  },
  featureItem: {
    color: '#1f2937',
    fontSize: 13,
    fontWeight: '600',
  },
});
