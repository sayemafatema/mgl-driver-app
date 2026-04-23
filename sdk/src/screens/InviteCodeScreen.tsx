import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useMGLApp } from '../context/MGLContext';

const INVITE_CODES_DB: Record<string, string> = { 'ABC123': 'ABC Logistics Pvt. Ltd.', 'XYZ789': 'XYZ Transport' };

export function InviteCodeScreen() {
  const { inviteCode, setInviteCode, otpError, setOtpError, setOnboardingStep, onboardingStep } = useMGLApp();

  if (onboardingStep === '1c') {
    return (
      <View style={{ gap: 16 }}>
        <View style={{ backgroundColor: '#dcfce7', borderWidth: 1, borderColor: '#86efac', borderRadius: 12, padding: 16, gap: 4 }}>
          <Text style={{ fontSize: 12, color: '#15803d', fontWeight: '700' }}>Invite from</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{INVITE_CODES_DB[inviteCode] || 'Fleet Operator'}</Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>Confirm your mobile</Text>
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setOnboardingStep('login')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
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
          if (company) { setOnboardingStep('1c'); }
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
