import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const DashboardScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Welcome back ✨</Text>
      <Text style={styles.subtext}>Your AI Career Dashboard</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Job Matches</Text>
        <Text style={styles.cardVal}>3 High-Match Opportunities</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ XP Level</Text>
        <Text style={styles.cardVal}>Level 12 • 12,480 XP</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  subtext: { fontSize: 14, color: '#94a3b8', marginBottom: 20 },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 14, color: '#38bdf8', fontWeight: 'bold' },
  cardVal: { fontSize: 16, color: '#ffffff', marginTop: 4, fontWeight: '600' },
});
