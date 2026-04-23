import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, QrCode, AlertCircle, History, User, X } from 'lucide-react-native';

import { useMGLApp } from '../context/MGLContext';
import type {
  AuthStackParamList, MainStackParamList, MainTabParamList,
} from '../types';

import { LoginScreen } from '../screens/LoginScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { PinLoginScreen } from '../screens/PinLoginScreen';
import { ForgotPinScreen } from '../screens/ForgotPinScreen';
import { SetPinScreen } from '../screens/SetPinScreen';
import { ConfirmPinScreen } from '../screens/ConfirmPinScreen';
import { InviteCodeScreen } from '../screens/InviteCodeScreen';
import { InviteConfirmScreen } from '../screens/InviteConfirmScreen';
import { RegisteredScreen } from '../screens/RegisteredScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { AssignmentsScreen } from '../screens/AssignmentsScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AssignmentNotificationScreen } from '../screens/AssignmentNotificationScreen';
import { PairingCodeScreen } from '../screens/PairingCodeScreen';
import { AssignmentAcceptedScreen } from '../screens/AssignmentAcceptedScreen';

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  const { onClose } = useMGLApp();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 12 }}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <X size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      <AuthStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="LoginOtp" component={LoginOtpScreenWrapper} />
        <AuthStack.Screen name="PinLogin" component={PinLoginScreen} />
        <AuthStack.Screen name="ForgotPin" component={ForgotPinScreen} />
        <AuthStack.Screen name="ForgotOtp" component={ForgotOtpScreenWrapper} />
        <AuthStack.Screen name="InviteCode" component={InviteCodeScreen} />
        <AuthStack.Screen name="InviteConfirm" component={InviteConfirmScreen} />
        <AuthStack.Screen name="OnboardingOtp" component={OnboardingOtpScreenWrapper} />
        <AuthStack.Screen name="SetPin" component={SetPinScreen} />
        <AuthStack.Screen name="ConfirmPin" component={ConfirmPinScreen} />
        <AuthStack.Screen name="Registered" component={RegisteredScreen} />
      </AuthStack.Navigator>
    </View>
  );
}

function LoginOtpScreenWrapper() { return <ScreenPadding><OtpScreen variant="login" /></ScreenPadding>; }
function OnboardingOtpScreenWrapper() { return <ScreenPadding><OtpScreen variant="onboarding" /></ScreenPadding>; }
function ForgotOtpScreenWrapper() { return <ScreenPadding><OtpScreen variant="reset" /></ScreenPadding>; }

function ScreenPadding({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

function MainTabs() {
  const { pendingAssignmentCount } = useMGLApp();

  const tabs: Array<{ name: keyof MainTabParamList; label: string; Icon: React.ComponentType<{ size: number; color: string }> }> = [
    { name: 'Home', label: 'Home', Icon: Home },
    { name: 'Scan', label: 'Scan', Icon: QrCode },
    { name: 'Assignments', label: 'Assignments', Icon: AlertCircle },
    { name: 'Transactions', label: 'History', Icon: History },
    { name: 'Profile', label: 'Profile', Icon: User },
  ];

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f3f4f6', backgroundColor: '#fff', paddingBottom: 4 }}>
          {tabs.map(({ name, label, Icon }, index) => {
            const active = state.index === index;
            const showBadge = name === 'Assignments' && pendingAssignmentCount > 0;
            return (
              <TouchableOpacity
                key={name}
                onPress={() => navigation.navigate(name)}
                activeOpacity={0.7}
                style={{ flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}
              >
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
      )}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Assignments" component={AssignmentsScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppHeader() {
  const { driver, onClose, sessionState } = useMGLApp();
  return (
    <>
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
    </>
  );
}

function MainNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <MainStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }}>
        <MainStack.Screen name="Tabs" component={MainTabs} />
        <MainStack.Screen name="AssignmentNotification" component={AssignmentNotificationScreen} />
        <MainStack.Screen name="PairingCode" component={PairingCodeScreen} />
        <MainStack.Screen name="AssignmentAccepted" component={AssignmentAcceptedScreen} />
      </MainStack.Navigator>
    </View>
  );
}

export function MGLNavigator() {
  const { isAuthenticated } = useMGLApp();

  return (
    <NavigationContainer independent={true}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
