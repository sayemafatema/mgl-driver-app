import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useMGLApp } from '../context/MGLContext';
import type { AuthStackParamList } from '../types';

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { mobileNumber, setMobileNumber, setOtpDigits, setOtpError, setOtpCountdown, setInviteCode } = useMGLApp();

  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Image source={require('../assets/mgl-logo.png')} style={{ width: 72, height: 72, resizeMode: 'contain' }} />
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 12 }}>MGL Fleet Connect</Text>
        <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Driver App</Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ gap: 16 }}>
        <View>
          <Text style={{ fontSize: 12, color: '#4b5563', fontWeight: '500', marginBottom: 8 }}>Mobile number</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, backgroundColor: '#f9fafb' }}>
              <Text style={{ color: '#4b5563', fontWeight: '500', fontSize: 14 }}>+91</Text>
            </View>
            <TextInput
              value={mobileNumber}
              onChangeText={(t) => setMobileNumber(t.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter your mobile number"
              keyboardType="numeric"
              maxLength={10}
              style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, fontSize: 14 }}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => { setOtpDigits(Array(6).fill('')); setOtpError(''); setOtpCountdown(30); navigation.navigate('LoginOtp'); }}
          disabled={mobileNumber.length !== 10}
          activeOpacity={0.7}
          style={{ backgroundColor: mobileNumber.length !== 10 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Send OTP</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#d1d5db' }} />
          <Text style={{ fontSize: 12, color: '#6b7280' }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#d1d5db' }} />
        </View>
        <TouchableOpacity
          onPress={() => { setInviteCode(''); navigation.navigate('InviteCode'); }}
          activeOpacity={0.7}
          style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
        >
          <Text style={{ color: '#374151', fontWeight: '500' }}>New user? I have an invite code</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 16 }}>By continuing you agree to MGL Fleet Terms of Service</Text>
      </View>
    </View>
  );
}
