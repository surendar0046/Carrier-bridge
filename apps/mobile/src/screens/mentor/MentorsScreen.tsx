import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MentorsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>1-on-1 Mentors</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  title: { fontSize: 20, color: '#ffffff', fontWeight: 'bold' },
});
