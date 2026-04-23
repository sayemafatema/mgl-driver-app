import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useMGLApp } from '../context/MGLContext';
import { Numpad } from '../components/Numpad';
import { PinDisplay } from '../components/PinDisplay';
import type { AuthStackParamList } from '../types';

type Nav = StackNavigationProp<AuthStackParamList, 'PinLogin'>;

export function PinLoginScreen() {
  const navigation = useNavigation<Nav>();
  const {
    loginPin, setLoginPin, loginPinError, setLoginPinError,
    wrongAttempts, setWrongAttempts, disableNumpad, setDisableNumpad,
    setOtpDigits, setOtpError, setOtpCountdown, driver, onAuthComplete,
  } = useMGLApp();

  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Image source={require('../assets/mgl-logo.png')} style={{ width: 48, height: 48, resizeMode: 'contain' }} />
        <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>Welcome back</Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 4 }}>{driver.name}</Text>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 8 }}>Enter your PIN</Text>
      <PinDisplay value={loginPin} error={!!loginPinError} />
      {loginPinError ? <Text style={{ color: '#ef4444', textAlign: 'center', marginBottom: 8 }}>{loginPinError}</Text> : null}
      <Numpad
        onPress={(d) => {
          if (disableNumpad) return;
          if (loginPin.length < 6) {
            const next = loginPin + d;
            setLoginPin(next);
            if (next.length === 6) {
              if (next === '123456') {
                onAuthComplete();
              } else {
                const attempts = wrongAttempts + 1;
                setWrongAttempts(attempts);
                setLoginPinError('Incorrect PIN');
                if (attempts >= 3) setDisableNumpad(true);
                setTimeout(() => { setLoginPin(''); setLoginPinError(''); }, 1000);
              }
            }
          }
        }}
        onBackspace={() => setLoginPin(loginPin.slice(0, -1))}
      />
      <TouchableOpacity
        onPress={() => { setOtpDigits(Array(6).fill('')); setOtpError(''); setOtpCountdown(30); navigation.navigate('ForgotPin'); }}
        activeOpacity={0.7}
        style={{ marginTop: 16 }}
      >
        <Text style={{ textAlign: 'center', color: '#15803d', fontWeight: '600' }}>Forgot PIN?</Text>
      </TouchableOpacity>
    </View>
  );
}
