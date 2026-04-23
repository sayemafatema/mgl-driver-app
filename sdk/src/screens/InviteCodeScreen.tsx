import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useMGLApp } from '../context/MGLContext';
import type { AuthStackParamList } from '../types';

type Nav = StackNavigationProp<AuthStackParamList, 'InviteCode'>;

const INVITE_CODES_DB: Record<string, string> = {
  'ABC123': 'ABC Logistics Pvt. Ltd.',
  'XYZ789': 'XYZ Transport',
};

export function InviteCodeScreen() {
  const navigation = useNavigation<Nav>();
  const { inviteCode, setInviteCode, otpError, setOtpError } = useMGLApp();

  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <ChevronLeft size={20} color="#4b5563" />
        <Text style={{ color: '#4b5563' }}>Back</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Enter invite code</Text>
      <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Your Fleet Operator shared this with you</Text>
      <TextInput
        value={inviteCode}
        onChangeText={(t) => setInviteCode(t.toUpperCase().slice(0, 8))}
        placeholder="e.g. ABC123"
        style={{ paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, fontSize: 16, fontFamily: 'monospace', letterSpacing: 4, textAlign: 'center', marginBottom: 16 }}
      />
      <TouchableOpacity
        onPress={() => {
          const company = INVITE_CODES_DB[inviteCode];
          if (company) { navigation.navigate('InviteConfirm'); }
          else { setOtpError('Invalid invite code'); setTimeout(() => setOtpError(''), 1500); }
        }}
        disabled={inviteCode.length < 5}
        activeOpacity={0.7}
        style={{ backgroundColor: inviteCode.length < 5 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Continue</Text>
      </TouchableOpacity>
      {otpError ? <Text style={{ color: '#ef4444', textAlign: 'center', marginTop: 8 }}>{otpError}</Text> : null}
    </View>
  );
}
