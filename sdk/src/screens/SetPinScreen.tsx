import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp, RouteProp } from '@react-navigation/stack';
import { useMGLApp } from '../context/MGLContext';
import { Numpad } from '../components/Numpad';
import { PinDisplay } from '../components/PinDisplay';
import type { AuthStackParamList, SetPinMode } from '../types';

type Nav = StackNavigationProp<AuthStackParamList, 'SetPin'>;
type Route = RouteProp<AuthStackParamList, 'SetPin'>;

export function SetPinScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const mode: SetPinMode = route.params?.mode ?? 'onboarding';
  const { pin, setPin, setPinConfirm, setPinError } = useMGLApp();

  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 }}>Create your PIN</Text>
      <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Choose a 6-digit PIN for quick login</Text>
      <PinDisplay value={pin} />
      <Numpad onPress={(d) => { if (pin.length < 6) setPin(pin + d); }} onBackspace={() => setPin(pin.slice(0, -1))} />
      <TouchableOpacity
        onPress={() => { setPinConfirm(''); setPinError(''); navigation.navigate('ConfirmPin', { mode }); }}
        disabled={pin.length !== 6}
        activeOpacity={0.7}
        style={{ backgroundColor: pin.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
