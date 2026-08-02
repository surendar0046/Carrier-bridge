import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ResumeBuilderScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resume Builder</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  title: { fontSize: 20, color: '#ffffff', fontWeight: 'bold' },
});
