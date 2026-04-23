import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp, RouteProp } from '@react-navigation/stack';
import { useMGLApp } from '../context/MGLContext';
import { Numpad } from '../components/Numpad';
import { PinDisplay } from '../components/PinDisplay';
import type { AuthStackParamList, SetPinMode } from '../types';

type Nav = StackNavigationProp<AuthStackParamList, 'ConfirmPin'>;
type Route = RouteProp<AuthStackParamList, 'ConfirmPin'>;

export function ConfirmPinScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const mode: SetPinMode = route.params?.mode ?? 'onboarding';
  const { pin, setPin, pinConfirm, setPinConfirm, pinError, setPinError, onAuthComplete } = useMGLApp();

  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
      <TouchableOpacity
        onPress={() => { setPin(''); navigation.goBack(); }}
        activeOpacity={0.7}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}
      >
        <ChevronLeft size={20} color="#4b5563" />
        <Text style={{ color: '#4b5563' }}>Back</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 }}>Confirm your PIN</Text>
      <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Re-enter the PIN you just created</Text>
      <PinDisplay value={pinConfirm} error={!!pinError} />
      {pinError ? <Text style={{ color: '#ef4444', textAlign: 'center', marginBottom: 8 }}>{pinError}</Text> : null}
      <Numpad
        onPress={(d) => {
          if (pinConfirm.length < 6) {
            const next = pinConfirm + d;
            setPinConfirm(next);
            if (next.length === 6) {
              if (next === pin) {
                if (mode === 'onboarding') {
                  navigation.navigate('Registered');
                } else {
                  onAuthComplete();
                }
              } else {
                setPinError('PINs do not match');
                setTimeout(() => { setPinConfirm(''); setPinError(''); }, 1000);
              }
            }
          }
        }}
        onBackspace={() => setPinConfirm(pinConfirm.slice(0, -1))}
      />
    </View>
  );
}
