import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useMGLApp } from '../context/MGLContext';

const INVITE_CODES_DB: Record<string, string> = { 'ABC123': 'ABC Logistics Pvt. Ltd.', 'XYZ789': 'XYZ Transport' };

export function InviteConfirmScreen() {
  const {
    inviteCode, mobileNumber, setMobileNumber,
    setOtpDigits, setOtpError, setOtpCountdown, setOnboardingStep,
  } = useMGLApp();

  const companyName = INVITE_CODES_DB[inviteCode] || 'Fleet Operator';

  return (
    <View style={{ gap: 16 }}>
      <View style={{ backgroundColor: '#dcfce7', borderWidth: 1, borderColor: '#86efac', borderRadius: 12, padding: 16, gap: 4 }}>
        <Text style={{ fontSize: 12, color: '#15803d', fontWeight: '700' }}>Invite from</Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{companyName}</Text>
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>Confirm your mobile</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, backgroundColor: '#f9fafb' }}>
          <Text style={{ color: '#4b5563', fontWeight: '500', fontSize: 14 }}>+91</Text>
        </View>
        <TextInput
          value={mobileNumber}
          onChangeText={(t) => setMobileNumber(t.replace(/\D/g, '').slice(0, 10))}
          placeholder="Enter mobile number"
          keyboardType="numeric"
          maxLength={10}
          style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, fontSize: 14 }}
        />
      </View>
      <TouchableOpacity
        onPress={() => { setOtpDigits(Array(6).fill('')); setOtpError(''); setOtpCountdown(30); setOnboardingStep('1d'); }}
        disabled={mobileNumber.length !== 10}
        activeOpacity={0.7}
        style={{ backgroundColor: mobileNumber.length !== 10 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
