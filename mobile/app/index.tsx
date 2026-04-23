import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MGLProvider, MGLLaunchButton, MGLModal } from '../../sdk/src';

export default function App() {
  return (
    <MGLProvider config={{ mockMode: true }}>
      <View style={styles.container}>
        <MGLLaunchButton label="Open MGL Fleet Connect" />
      </View>
      <MGLModal />
    </MGLProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
});
