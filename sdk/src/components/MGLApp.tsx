import React from 'react';
import { SafeAreaView } from 'react-native';
import { MGLNavigator } from '../navigation/MGLNavigator';

export function MGLApp() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <MGLNavigator />
    </SafeAreaView>
  );
}
