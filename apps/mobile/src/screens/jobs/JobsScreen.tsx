import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface MobileJobItem {
  id: string;
  title: string;
  company: string;
  match: string;
}

const mockJobs: MobileJobItem[] = [
  { id: '1', title: 'Senior Full Stack Engineer', company: 'TechCorp', match: '96%' },
  { id: '2', title: 'AI Engineering Lead', company: 'Niral Systems', match: '94%' },
];

export const JobsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommended Jobs</Text>
      <FlatList
        data={mockJobs}
        keyExtractor={(item: MobileJobItem) => item.id}
        renderItem={({ item }: { item: MobileJobItem }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.match}>{item.match} Match</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 16 },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 16, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  company: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  match: { fontSize: 12, color: '#4ade80', fontWeight: 'bold', marginTop: 8 },
});
