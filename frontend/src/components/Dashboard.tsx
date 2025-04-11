import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  gradeText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cardContainer: {
    gap: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

const Dashboard = () => {
  const route = useRoute();
  const { username, grade } = route.params as { username: string; grade: string };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {username}!</Text>
          <Text style={styles.gradeText}>Grade {grade}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Mathematics</Text>
              <Text style={styles.cardSubtitle}>Progress: 75%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Science</Text>
              <Text style={styles.cardSubtitle}>Progress: 60%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>English</Text>
              <Text style={styles.cardSubtitle}>Progress: 85%</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Math Quiz</Text>
              <Text style={styles.cardSubtitle}>Due: Tomorrow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Science Project</Text>
              <Text style={styles.cardSubtitle}>Due: Next Week</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard; 