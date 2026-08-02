import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const SignupScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, color: '#ffffff', fontWeight: 'bold' },
});
