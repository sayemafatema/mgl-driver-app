import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Home, QrCode, AlertCircle, History, User, X } from 'lucide-react-native';
import { useMGLApp } from '../context/MGLContext';
import { AuthScreens } from '../screens/AuthScreens';
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { AssignmentsScreen } from '../screens/AssignmentsScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AssignmentNotificationScreen } from '../screens/AssignmentNotificationScreen';
import { PairingCodeScreen } from '../screens/PairingCodeScreen';
import { AssignmentAcceptedScreen } from '../screens/AssignmentAcceptedScreen';

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
          <TouchableOpacity
            key={id}
            onPress={() => setActiveTab(id)}
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
  );
}

function MainAppShell() {
  const {
    driver, onClose, currentMainScreen, activeTab, sessionState, successToast,
  } = useMGLApp();

  if (currentMainScreen === 'assignment_notification') return <AssignmentNotificationScreen />;
  if (currentMainScreen === 'pairing_code') return <PairingCodeScreen />;
  if (currentMainScreen === 'assignment_accepted') return <AssignmentAcceptedScreen />;

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
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
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Session Banner */}
      {sessionState !== 'idle' && (
        <View style={{ backgroundColor: '#dbeafe', borderBottomWidth: 1, borderBottomColor: '#93c5fd', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' }} />
          <Text style={{ color: '#1e40af', fontWeight: '600', fontSize: 12 }}>Fueling in progress</Text>
        </View>
      )}

      {/* Success Toast */}
      {successToast && (
        <View style={{ backgroundColor: '#16a34a', paddingHorizontal: 24, paddingVertical: 12 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{successToast}</Text>
        </View>
      )}

      {/* Tab Content */}
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

  if (onboardingStep !== 'complete') {
    return <AuthScreens />;
  }

  return <MainAppShell />;
}
