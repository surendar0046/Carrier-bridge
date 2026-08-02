import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Career Bridge Mobile</Text>
      <Text style={styles.subtitle}>AI-Powered Career OS</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 8, marginBottom: 24 },
  button: { backgroundColor: '#2563eb', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
