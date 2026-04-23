import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useMGLApp } from '../context/MGLContext';

export function RegisteredScreen() {
  const { setOnboardingStep } = useMGLApp();

  return (
    <View style={{ alignItems: 'center', gap: 20 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 36 }}>✓</Text>
      </View>
      <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827', textAlign: 'center' }}>You're all set!</Text>
      <Text style={{ fontSize: 14, color: '#4b5563', textAlign: 'center' }}>Your account has been created. You can now use MGL Fleet Connect.</Text>
      <TouchableOpacity
        onPress={() => setOnboardingStep('complete')}
        activeOpacity={0.7}
        style={{ backgroundColor: '#15803d', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
}
