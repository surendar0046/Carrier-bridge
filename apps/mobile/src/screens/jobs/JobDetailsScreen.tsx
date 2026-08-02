import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const JobDetailsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  title: { fontSize: 20, color: '#ffffff', fontWeight: 'bold' },
});
