import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useMGLApp } from '../context/MGLContext';
import type { AuthStackParamList } from '../types';

type Nav = StackNavigationProp<AuthStackParamList, 'ForgotPin'>;

export function ForgotPinScreen() {
  const navigation = useNavigation<Nav>();
  const { setOtpDigits, setOtpError, setOtpCountdown, mobileNumber } = useMGLApp();

  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <ChevronLeft size={20} color="#4b5563" />
        <Text style={{ color: '#4b5563' }}>Back</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Reset your PIN</Text>
      <View style={{ backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 12, padding: 12, marginBottom: 24 }}>
        <Text style={{ fontSize: 14, color: '#1e3a5f' }}>
          We'll send an OTP to +91 {mobileNumber ? mobileNumber.slice(-4).padStart(10, '•') : '••••••1234'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => { setOtpDigits(Array(6).fill('')); setOtpError(''); setOtpCountdown(30); navigation.navigate('ForgotOtp'); }}
        activeOpacity={0.7}
        style={{ backgroundColor: '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
