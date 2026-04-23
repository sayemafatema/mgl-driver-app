import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView, Image, SafeAreaView,
} from 'react-native';
import { ChevronLeft, X } from 'lucide-react-native';
import { useMGLApp } from '../context/MGLContext';
import { Numpad } from '../components/Numpad';
import { PinDisplay } from '../components/PinDisplay';

const DRIVER = { name: 'Ravi Sharma' };
const INVITE_CODES_DB: Record<string, string> = { 'ABC123': 'ABC Logistics Pvt. Ltd.', 'XYZ789': 'XYZ Transport' };

export function AuthScreens() {
  const app = useMGLApp();
  const {
    onboardingStep, setOnboardingStep, onClose,
    mobileNumber, setMobileNumber,
    otpDigits, setOtpDigits, otpError, setOtpError, otpCountdown, setOtpCountdown,
    loginOtpRefs, handleLoginOtpVerify,
    pin, setPin, pinConfirm, setPinConfirm, pinError, setPinError,
    loginPin, setLoginPin, loginPinError, setLoginPinError,
    wrongAttempts, setWrongAttempts, disableNumpad, setDisableNumpad,
    newPin, setNewPin, inviteCode, setInviteCode,
    handlePinInput, handlePinBackspace,
    onboardingOtpRefs, resetOtpRefs,
  } = app;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16 }}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <X size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">

        {/* Login */}
        {onboardingStep === 'login' && (
          <View style={{ flex: 1 }}>
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
                onPress={() => { setOtpDigits(Array(6).fill('')); setOtpError(''); setOtpCountdown(30); setOnboardingStep('login_otp'); }}
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
                onPress={() => { setInviteCode(''); setOnboardingStep('invite_code'); }}
                activeOpacity={0.7}
                style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#374151', fontWeight: '500' }}>New user? I have an invite code</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 16 }}>By continuing you agree to MGL Fleet Terms of Service</Text>
            </View>
          </View>
        )}

        {/* Login OTP */}
        {onboardingStep === 'login_otp' && (
          <View>
            <TouchableOpacity onPress={() => setOnboardingStep('login')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <ChevronLeft size={20} color="#4b5563" />
              <Text style={{ color: '#4b5563' }}>Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Verify mobile</Text>
            <View style={{ backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 12, padding: 12, marginBottom: 24 }}>
              <Text style={{ fontSize: 14, color: '#1e3a5f' }}>OTP sent to +91 {mobileNumber.slice(-4).padStart(10, '•')}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { loginOtpRefs.current[i] = r; }}
                  value={otpDigits[i] || ''}
                  onChangeText={(val) => {
                    const digit = val.replace(/\D/g, '').slice(-1);
                    const newDigits = [...otpDigits];
                    newDigits[i] = digit;
                    setOtpDigits(newDigits);
                    if (digit && i < 5) loginOtpRefs.current[i + 1]?.focus();
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  style={{ width: 42, height: 42, textAlign: 'center', fontSize: 18, fontWeight: '700', borderWidth: 2, borderRadius: 8, borderColor: otpDigits[i] ? '#15803d' : '#d1d5db' }}
                />
              ))}
            </View>
            {otpError ? <Text style={{ color: '#ef4444', fontSize: 14, textAlign: 'center', marginBottom: 8 }}>{otpError}</Text> : null}
            <TouchableOpacity
              onPress={handleLoginOtpVerify}
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
        )}

        {/* PIN Login */}
        {onboardingStep === 'pin_login' && (
          <View>
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <Image source={require('../assets/mgl-logo.png')} style={{ width: 48, height: 48, resizeMode: 'contain' }} />
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>Welcome back</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 4 }}>{DRIVER.name}</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 8 }}>Enter your PIN</Text>
            <PinDisplay value={loginPin} error={!!loginPinError} />
            {loginPinError ? <Text style={{ color: '#ef4444', textAlign: 'center', marginBottom: 8 }}>{loginPinError}</Text> : null}
            <Numpad
              onPress={(d) => {
                if (loginPin.length < 6) {
                  const next = loginPin + d;
                  setLoginPin(next);
                  if (next.length === 6) {
                    if (next === '123456') {
                      setOnboardingStep('complete');
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
            <TouchableOpacity onPress={() => { setOtpDigits(Array(6).fill('')); setOtpError(''); setOtpCountdown(30); setOnboardingStep('forgot_pin'); }} activeOpacity={0.7} style={{ marginTop: 16 }}>
              <Text style={{ textAlign: 'center', color: '#15803d', fontWeight: '600' }}>Forgot PIN?</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Set PIN */}
        {onboardingStep === 'set_pin' && (
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 }}>Create your PIN</Text>
            <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Choose a 6-digit PIN for quick login</Text>
            <PinDisplay value={pin} />
            <Numpad onPress={(d) => handlePinInput(d)} onBackspace={() => handlePinBackspace()} />
            <TouchableOpacity
              onPress={() => { setPinConfirm(''); setPinError(''); setOnboardingStep('confirm_pin'); }}
              disabled={pin.length !== 6}
              activeOpacity={0.7}
              style={{ backgroundColor: pin.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Confirm PIN */}
        {onboardingStep === 'confirm_pin' && (
          <View>
            <TouchableOpacity onPress={() => { setPin(''); setOnboardingStep('set_pin'); }} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
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
                    if (next === pin) { setOnboardingStep('complete'); }
                    else { setPinError('PINs do not match'); setTimeout(() => { setPinConfirm(''); setPinError(''); }, 1000); }
                  }
                }
              }}
              onBackspace={() => setPinConfirm(pinConfirm.slice(0, -1))}
            />
          </View>
        )}

        {/* Forgot PIN */}
        {onboardingStep === 'forgot_pin' && (
          <View>
            <TouchableOpacity onPress={() => setOnboardingStep('pin_login')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <ChevronLeft size={20} color="#4b5563" />
              <Text style={{ color: '#4b5563' }}>Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Reset your PIN</Text>
            <View style={{ backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 12, padding: 12, marginBottom: 24 }}>
              <Text style={{ fontSize: 14, color: '#1e3a5f' }}>We'll send an OTP to +91 ••••••1234</Text>
            </View>
            <TouchableOpacity
              onPress={() => { setOtpDigits(Array(6).fill('')); setOtpError(''); setOtpCountdown(30); setOnboardingStep('forgot_otp'); }}
              activeOpacity={0.7}
              style={{ backgroundColor: '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Forgot OTP */}
        {onboardingStep === 'forgot_otp' && (
          <View>
            <TouchableOpacity onPress={() => setOnboardingStep('forgot_pin')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <ChevronLeft size={20} color="#4b5563" />
              <Text style={{ color: '#4b5563' }}>Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Enter OTP</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { resetOtpRefs.current[i] = r; }}
                  value={otpDigits[i] || ''}
                  onChangeText={(val) => {
                    const digit = val.replace(/\D/g, '').slice(-1);
                    const newDigits = [...otpDigits];
                    newDigits[i] = digit;
                    setOtpDigits(newDigits);
                    if (digit && i < 5) resetOtpRefs.current[i + 1]?.focus();
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  style={{ width: 42, height: 42, textAlign: 'center', fontSize: 18, fontWeight: '700', borderWidth: 2, borderRadius: 8, borderColor: otpDigits[i] ? '#15803d' : '#d1d5db' }}
                />
              ))}
            </View>
            <TouchableOpacity
              onPress={() => {
                if (otpDigits.join('') === '123456') {
                  setPin(''); setPinConfirm(''); setPinError(''); setNewPin('');
                  setOnboardingStep('set_pin');
                } else {
                  setOtpError('Incorrect OTP');
                  setTimeout(() => { setOtpDigits(Array(6).fill('')); setOtpError(''); }, 1500);
                }
              }}
              disabled={otpDigits.join('').length !== 6}
              activeOpacity={0.7}
              style={{ backgroundColor: otpDigits.join('').length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Verify</Text>
            </TouchableOpacity>
            {otpError ? <Text style={{ color: '#ef4444', textAlign: 'center' }}>{otpError}</Text> : null}
          </View>
        )}

        {/* Invite Code */}
        {onboardingStep === 'invite_code' && (
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
        )}

        {/* Step 1c */}
        {onboardingStep === '1c' && (
          <View style={{ gap: 16 }}>
            <View style={{ backgroundColor: '#dcfce7', borderWidth: 1, borderColor: '#86efac', borderRadius: 12, padding: 16, gap: 4 }}>
              <Text style={{ fontSize: 12, color: '#15803d', fontWeight: '700' }}>Invite from</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{INVITE_CODES_DB[inviteCode] || 'Fleet Operator'}</Text>
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
        )}

        {/* Step 1d – Onboarding OTP */}
        {onboardingStep === '1d' && (
          <View>
            <TouchableOpacity onPress={() => setOnboardingStep('1c')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <ChevronLeft size={20} color="#4b5563" />
              <Text style={{ color: '#4b5563' }}>Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 24 }}>Verify your mobile</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { onboardingOtpRefs.current[i] = r; }}
                  value={otpDigits[i] || ''}
                  onChangeText={(val) => {
                    const digit = val.replace(/\D/g, '').slice(-1);
                    const newDigits = [...otpDigits];
                    newDigits[i] = digit;
                    setOtpDigits(newDigits);
                    if (digit && i < 5) onboardingOtpRefs.current[i + 1]?.focus();
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  style={{ width: 42, height: 42, textAlign: 'center', fontSize: 18, fontWeight: '700', borderWidth: 2, borderRadius: 8, borderColor: otpDigits[i] ? '#15803d' : '#d1d5db' }}
                />
              ))}
            </View>
            {otpError ? <Text style={{ color: '#ef4444', textAlign: 'center', marginBottom: 8 }}>{otpError}</Text> : null}
            <TouchableOpacity
              onPress={() => {
                if (otpDigits.join('') === '123456') { setOnboardingStep('1e'); }
                else { setOtpError('Incorrect OTP'); setTimeout(() => { setOtpDigits(Array(6).fill('')); setOtpError(''); }, 1500); }
              }}
              disabled={otpDigits.join('').length !== 6}
              activeOpacity={0.7}
              style={{ backgroundColor: otpDigits.join('').length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Verify</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 1e – Set PIN for new user */}
        {onboardingStep === '1e' && (
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 }}>Create your PIN</Text>
            <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Choose a 6-digit PIN for quick login</Text>
            <PinDisplay value={pin} />
            <Numpad onPress={(d) => { if (pin.length < 6) setPin(pin + d); }} onBackspace={() => setPin(pin.slice(0, -1))} />
            <TouchableOpacity
              onPress={() => { setPinConfirm(''); setPinError(''); setOnboardingStep('1f'); }}
              disabled={pin.length !== 6}
              activeOpacity={0.7}
              style={{ backgroundColor: pin.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 1f – Confirm PIN for new user */}
        {onboardingStep === '1f' && (
          <View>
            <TouchableOpacity onPress={() => { setPin(''); setOnboardingStep('1e'); }} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <ChevronLeft size={20} color="#4b5563" />
              <Text style={{ color: '#4b5563' }}>Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 }}>Confirm your PIN</Text>
            <PinDisplay value={pinConfirm} error={!!pinError} />
            {pinError ? <Text style={{ color: '#ef4444', textAlign: 'center', marginBottom: 8 }}>{pinError}</Text> : null}
            <Numpad
              onPress={(d) => {
                if (pinConfirm.length < 6) {
                  const next = pinConfirm + d;
                  setPinConfirm(next);
                  if (next.length === 6) {
                    if (next === pin) { setOnboardingStep('registered'); }
                    else { setPinError('PINs do not match'); setTimeout(() => { setPinConfirm(''); setPinError(''); }, 1000); }
                  }
                }
              }}
              onBackspace={() => setPinConfirm(pinConfirm.slice(0, -1))}
            />
          </View>
        )}

        {/* Registered */}
        {onboardingStep === 'registered' && (
          <View style={{ alignItems: 'center', gap: 20 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 36 }}>✓</Text>
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827', textAlign: 'center' }}>You're all set!</Text>
            <Text style={{ fontSize: 14, color: '#4b5563', textAlign: 'center' }}>Your account has been created. You can now use MGL Fleet Connect.</Text>
            <TouchableOpacity
              onPress={() => setOnboardingStep('complete')}
              activeOpacity={0.7}
              style={{ backgroundColor: '#15803d', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Get started</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
