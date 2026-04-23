import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Home, QrCode, AlertCircle, History, User, X } from 'lucide-react-native';
import { useMGLApp } from '../context/MGLContext';

import { LoginScreen } from '../screens/LoginScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { PinLoginScreen } from '../screens/PinLoginScreen';
import { SetPinScreen } from '../screens/SetPinScreen';
import { ConfirmPinScreen } from '../screens/ConfirmPinScreen';
import { ForgotPinScreen } from '../screens/ForgotPinScreen';
import { InviteCodeScreen } from '../screens/InviteCodeScreen';
import { RegisteredScreen } from '../screens/RegisteredScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { AssignmentsScreen } from '../screens/AssignmentsScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AssignmentNotificationScreen } from '../screens/AssignmentNotificationScreen';
import { PairingCodeScreen } from '../screens/PairingCodeScreen';
import { AssignmentAcceptedScreen } from '../screens/AssignmentAcceptedScreen';

function AuthNavigator() {
  const { onboardingStep, mobileNumber, setMobileNumber, setOtpDigits, setOtpError, setOtpCountdown, setOnboardingStep } = useMGLApp();
  const { onClose } = useMGLApp();

  const INVITE_CODES_DB: Record<string, string> = { 'ABC123': 'ABC Logistics Pvt. Ltd.', 'XYZ789': 'XYZ Transport' };

  let screen: React.ReactNode;
  switch (onboardingStep) {
    case 'login':        screen = <LoginScreen />; break;
    case 'login_otp':    screen = <OtpScreen variant="login" />; break;
    case 'pin_login':    screen = <PinLoginScreen />; break;
    case 'set_pin':      screen = <SetPinScreen />; break;
    case 'confirm_pin':  screen = <ConfirmPinScreen />; break;
    case 'forgot_pin':   screen = <ForgotPinScreen />; break;
    case 'forgot_otp':   screen = <OtpScreen variant="reset" />; break;
    case 'invite_code':  screen = <InviteCodeScreen />; break;
    case 'registered':   screen = <RegisteredScreen />; break;
    case '1c': {
      const { inviteCode } = useMGLApp();
      screen = (
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
      break;
    }
    case '1d': screen = <OtpScreen variant="onboarding" />; break;
    case '1e': screen = <SetPinScreen />; break;
    case '1f': screen = <ConfirmPinScreen />; break;
    default:   screen = <LoginScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16 }}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <X size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
        {screen}
      </ScrollView>
    </View>
  );
}

function TabBar() {
  const { activeTab, setActiveTab, pendingAssignmentCount, sessionState } = useMGLApp();

  const tabs = [
    { id: 'card' as const, label: 'Home', Icon: Home },
    { id: 'scan' as const, label: 'Scan', Icon: QrCode },
    { id: 'assignments' as const, label: 'Assignments', Icon: AlertCircle },
    { id: 'transactions' as const, label: 'History', Icon: History },
    { id: 'profile' as const, label: 'Profile', Icon: User },
  ];

  return (
    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f3f4f6', backgroundColor: '#fff', paddingBottom: 4 }}>
      {tabs.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        const showBadge = id === 'assignments' && pendingAssignmentCount > 0;
        return (
          <TouchableOpacity key={id} onPress={() => setActiveTab(id)} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
            <View style={{ position: 'relative' }}>
              <Icon size={22} color={active ? '#15803d' : '#9ca3af'} />
              {showBadge && (
                <View style={{ position: 'absolute', top: -4, right: -6, width: 14, height: 14, borderRadius: 7, backgroundColor: '#d97706', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{pendingAssignmentCount}</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 10, marginTop: 2, color: active ? '#15803d' : '#9ca3af', fontWeight: active ? '700' : '400' }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainAppShell() {
  const { driver, onClose, currentMainScreen, activeTab, sessionState, successToast } = useMGLApp();

  if (currentMainScreen === 'assignment_notification') return <AssignmentNotificationScreen />;
  if (currentMainScreen === 'pairing_code') return <PairingCodeScreen />;
  if (currentMainScreen === 'assignment_accepted') return <AssignmentAcceptedScreen />;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#16a34a', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: '#bbf7d0', fontSize: 14 }}>Good morning</Text>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20, marginTop: 2 }}>{driver.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{driver.initials}</Text>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {sessionState !== 'idle' && (
        <View style={{ backgroundColor: '#dbeafe', borderBottomWidth: 1, borderBottomColor: '#93c5fd', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' }} />
          <Text style={{ color: '#1e40af', fontWeight: '600', fontSize: 12 }}>Fueling in progress</Text>
        </View>
      )}
      {successToast && (
        <View style={{ backgroundColor: '#16a34a', paddingHorizontal: 24, paddingVertical: 12 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{successToast}</Text>
        </View>
      )}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }} keyboardShouldPersistTaps="handled">
        {activeTab === 'card' && <HomeScreen />}
        {activeTab === 'scan' && <ScanScreen />}
        {activeTab === 'assignments' && <AssignmentsScreen />}
        {activeTab === 'transactions' && <TransactionsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </ScrollView>
      <TabBar />
    </View>
  );
}

export function MGLNavigator() {
  const { onboardingStep } = useMGLApp();
  if (onboardingStep !== 'complete') return <AuthNavigator />;
  return <MainAppShell />;
}
