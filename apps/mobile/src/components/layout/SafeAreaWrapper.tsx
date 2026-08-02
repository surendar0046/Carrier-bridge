import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children, style }) => {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
