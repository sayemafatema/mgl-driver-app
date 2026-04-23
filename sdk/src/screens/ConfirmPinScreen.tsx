import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useMGLApp } from '../context/MGLContext';
import { Numpad } from '../components/Numpad';
import { PinDisplay } from '../components/PinDisplay';
import type { OnboardingStep } from '../types';

export function ConfirmPinScreen() {
  const {
    pin, setPin, pinConfirm, setPinConfirm, pinError, setPinError,
    setOnboardingStep, onboardingStep,
  } = useMGLApp();

  const prevStep: OnboardingStep = onboardingStep === '1f' ? '1e' : 'set_pin';
  const successStep: OnboardingStep = onboardingStep === '1f' ? 'registered' : 'complete';

  return (
    <View>
      <TouchableOpacity
        onPress={() => { setPin(''); setOnboardingStep(prevStep); }}
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
                setOnboardingStep(successStep);
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
