import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useMGLApp } from '../context/MGLContext';

type OtpVariant = 'login' | 'onboarding' | 'reset';

interface OtpScreenProps {
  variant?: OtpVariant;
}

const VARIANT_TITLE: Record<OtpVariant, string> = {
  login: 'Verify mobile',
  onboarding: 'Verify your mobile',
  reset: 'Enter OTP',
};

export function OtpScreen({ variant = 'login' }: OtpScreenProps) {
  const {
    mobileNumber, otpDigits, setOtpDigits, otpError, setOtpError,
    otpCountdown, setOtpCountdown, handleLoginOtpVerify,
    loginOtpRefs, onboardingOtpRefs, resetOtpRefs,
    setOnboardingStep, pin, setPin, setPinConfirm, setPinError, setNewPin,
  } = useMGLApp();

  const refs = variant === 'login' ? loginOtpRefs : variant === 'onboarding' ? onboardingOtpRefs : resetOtpRefs;
  const backStep = variant === 'login' ? 'login' : variant === 'onboarding' ? '1c' : 'forgot_pin';

  function handleVerify() {
    const code = otpDigits.join('');
    if (code === '123456') {
      if (variant === 'login') handleLoginOtpVerify();
      else if (variant === 'onboarding') setOnboardingStep('1e');
      else { setPin(''); setPinConfirm(''); setPinError(''); setNewPin(''); setOnboardingStep('set_pin'); }
    } else {
      setOtpError('Incorrect OTP. Try again.');
      setTimeout(() => { setOtpDigits(Array(6).fill('')); setOtpError(''); }, 1500);
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setOnboardingStep(backStep as any)} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <ChevronLeft size={20} color="#4b5563" />
        <Text style={{ color: '#4b5563' }}>Back</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>{VARIANT_TITLE[variant]}</Text>
      {variant !== 'reset' && (
        <View style={{ backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 12, padding: 12, marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#1e3a5f' }}>OTP sent to +91 {mobileNumber.slice(-4).padStart(10, '•')}</Text>
        </View>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <TextInput
            key={i}
            ref={(r) => { refs.current[i] = r; }}
            value={otpDigits[i] || ''}
            onChangeText={(val) => {
              const digit = val.replace(/\D/g, '').slice(-1);
              const newDigits = [...otpDigits];
              newDigits[i] = digit;
              setOtpDigits(newDigits);
              if (digit && i < 5) refs.current[i + 1]?.focus();
            }}
            keyboardType="numeric"
            maxLength={1}
            style={{ width: 42, height: 42, textAlign: 'center', fontSize: 18, fontWeight: '700', borderWidth: 2, borderRadius: 8, borderColor: otpDigits[i] ? '#15803d' : '#d1d5db' }}
          />
        ))}
      </View>
      {otpError ? <Text style={{ color: '#ef4444', fontSize: 14, textAlign: 'center', marginBottom: 8 }}>{otpError}</Text> : null}
      <TouchableOpacity
        onPress={handleVerify}
        disabled={otpDigits.join('').length !== 6}
        activeOpacity={0.7}
        style={{ backgroundColor: otpDigits.join('').length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Verify</Text>
      </TouchableOpacity>
      {otpCountdown > 0 ? (
        <Text style={{ textAlign: 'center', fontSize: 12, color: '#6b7280' }}>Resend OTP in {otpCountdown}s</Text>
      ) : (
        <TouchableOpacity onPress={() => setOtpCountdown(30)} activeOpacity={0.7}>
          <Text style={{ textAlign: 'center', color: '#15803d', fontWeight: '600', fontSize: 14, paddingVertical: 8 }}>Resend OTP</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
