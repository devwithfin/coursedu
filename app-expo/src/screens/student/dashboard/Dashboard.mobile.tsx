import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import icons

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your course"
          placeholderTextColor="#666"
        />
      </View>

      {/* Academy Section Header */}
      <View style={styles.academyHeader}>
        <Text style={styles.sectionTitle}>Courses</Text>
        <Text style={styles.seeAllText}>See All</Text>
      </View>

      {/* Course Activity Cards */}
      <View style={styles.card}>
        <View style={styles.cardLeftContent}>
          <Text style={styles.courseTitle}>Course1</Text>
          <Text style={styles.teacherName}>Teacher Name</Text>
        </View>
        <Text style={styles.dateRange}>09/12/04 - 12/12/04</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardLeftContent}>
          <Text style={styles.courseTitle}>Course2</Text>
          <Text style={styles.teacherName}>Teacher Name</Text>
        </View>
        <Text style={styles.dateRange}>09/12/04 - 12/12/04</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardLeftContent}>
          <Text style={styles.courseTitle}>Course3</Text>
          <Text style={styles.teacherName}>Teacher Name</Text>
        </View>
        <Text style={styles.dateRange}>09/12/04 - 12/12/04</Text>
      </View>

      {/* Teachers Section Header */}
      <View style={styles.teachersHeader}>
        <Text style={styles.teachersTitle}>Teachers</Text>
        <Text style={styles.seeAllText}>See All</Text>
      </View>

      {/* Circular Teacher Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.circularTeachersScrollView}>
        <View style={styles.circularTeacherCard}>
          <View style={styles.circularTeacherImage}></View>
          <Text style={styles.circularTeacherName}>Teacher1</Text>
        </View>
        <View style={styles.circularTeacherCard}>
          <View style={styles.circularTeacherImage}></View>
          <Text style={styles.circularTeacherName}>Teacher2</Text>
        </View>
        <View style={styles.circularTeacherCard}>
          <View style={styles.circularTeacherImage}></View>
          <Text style={styles.circularTeacherName}>Teacher3</Text>
        </View>
        <View style={styles.circularTeacherCard}>
          <View style={styles.circularTeacherImage}></View>
          <Text style={styles.circularTeacherName}>Teacher4</Text>
        </View>
      </ScrollView>

      {/* Latest Material Section Header */}
      <View style={styles.latestMaterialHeader}>
        <Text style={styles.latestMaterialTitleHeader}>Latest Material</Text>
      </View>

      {/* Latest Material Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.latestMaterialScrollView}>
        <View style={styles.latestMaterialCard}>
          <View style={styles.latestMaterialImagePlaceholder}></View>
          <Text style={styles.latestMaterialCardTitle}>Material Title 1</Text>
          <Text style={styles.latestMaterialCardContentTitle}>Content title for material 1</Text>
        </View>
        <View style={styles.latestMaterialCard}>
          <View style={styles.latestMaterialImagePlaceholder}></View>
          <Text style={styles.latestMaterialCardTitle}>Material Title 2</Text>
          <Text style={styles.latestMaterialCardContentTitle}>Content title for material 2</Text>
        </View>
        <View style={styles.latestMaterialCard}>
          <View style={styles.latestMaterialImagePlaceholder}></View>
          <Text style={styles.latestMaterialCardTitle}>Material Title 3</Text>
          <Text style={styles.latestMaterialCardContentTitle}>Content title for material 3</Text>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // General Styles
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 20, // Add some top padding
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 30,
    marginBottom: 15,
    marginLeft: 20, // Align with the search bar's left margin
  },
  seeAllText: {
    fontSize: 14,
    color: '#083D7F',
    fontWeight: 'bold',
  },

  // Search Bar Styles
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25, // Rounded pill shape
    paddingHorizontal: 15,
    paddingVertical: 15, // Increased vertical padding
    marginHorizontal: 20,
    width: '90%', // Full width with some margin
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    alignSelf: 'center', // Center the search bar
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14, // Decreased font size
    color: '#333',
    paddingVertical: 0,
  },

  // Course Activity Cards Styles
  academyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20, // Align with other content
    marginTop: 30, // Consistent space from previous section
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  cardLeftContent: {
    flex: 1, // Take up available space
    justifyContent: 'center', // Center vertically
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#083D7F', // Changed color
  },
  teacherName: {
    fontSize: 14,
    color: '#666',
  },
  dateRange: {
    fontSize: 10, // Decreased font size
    color: '#888',
    textAlign: 'right', // Align to right
  },

  // Teachers Section Styles
  teachersHeader: { // New style for Teachers section header
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30, // Space from previous section
    marginBottom: 15,
  },
  teachersTitle: { // New style for Teachers title
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  circularTeachersScrollView: { // New style for Teachers ScrollView
    paddingLeft: 20,
    marginTop: 10,
  },
  circularTeacherCard: { // New style for individual teacher cards
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  circularTeacherImage: { // New style for teacher circular image
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0', // Placeholder color
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  circularTeacherName: { // New style for teacher name
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  // Latest Material Section Styles
  latestMaterialHeader: { // Style for Latest Material section header
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 15,
  },
  latestMaterialTitleHeader: { // Style for Latest Material title
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  latestMaterialScrollView: { // Style for horizontal ScrollView of latest materials
    paddingLeft: 20,
    marginTop: 10,
  },
  latestMaterialCard: { // Style for individual latest material cards (vertical rectangle)
    width: 150, // Fixed width for vertical card
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  latestMaterialImagePlaceholder: { // Placeholder for material image
    width: '100%',
    height: 90, // Rectangular image placeholder
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
  },
  latestMaterialCardTitle: { // Style for material title within card
    fontSize: 14,
    fontWeight: 'bold',
    color: '#083D7F',
    marginBottom: 5,
  },
  latestMaterialCardContentTitle: { // Style for material content title within card
    fontSize: 12,
    color: '#666',
  },
});