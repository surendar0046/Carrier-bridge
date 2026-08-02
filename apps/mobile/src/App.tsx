import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <SafeAreaView style={styles.container}>
        <RootNavigator />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
