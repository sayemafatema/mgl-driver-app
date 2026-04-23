import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle, Clock, Route, ChevronRight, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useMGLApp } from '../context/MGLContext';
import type { MainStackParamList } from '../types';

type Nav = StackNavigationProp<MainStackParamList, 'Tabs'>;

export function AssignmentsScreen() {
  const navigation = useNavigation<Nav>();
  const {
    activeBindings, pendingBindings, repairBindings,
    expandPastAssignments, setExpandPastAssignments,
    setActiveAssignment,
  } = useMGLApp();

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>My Assignments</Text>

      {pendingBindings.length > 0 && (
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#d97706', textTransform: 'uppercase', letterSpacing: 1 }}>Needs action</Text>
          {pendingBindings.map((b) => (
            <TouchableOpacity
              key={b.id}
              onPress={() => { setActiveAssignment(b); navigation.navigate('AssignmentNotification', { bindingId: b.id }); }}
              activeOpacity={0.7}
              style={{ borderWidth: 2, borderColor: '#fde68a', borderRadius: 12, padding: 16, backgroundColor: '#fffbeb', gap: 8 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: '#111827', fontSize: 16 }}>{b.vrn}</Text>
                <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#78350f' }}>Pending</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, color: '#4b5563' }}>{b.fo}</Text>
              <Text style={{ fontSize: 13, color: '#78350f' }}>Assigned by {b.assignedBy || 'Fleet Manager'} · Needs acceptance</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <AlertCircle size={14} color="#d97706" />
                <Text style={{ fontSize: 12, color: '#b45309' }}>Tap to review & accept</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {repairBindings.length > 0 && (
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>Pairing needed</Text>
          {repairBindings.map((b) => (
            <TouchableOpacity
              key={b.id}
              onPress={() => { setActiveAssignment(b); navigation.navigate('PairingCode', { bindingId: b.id }); }}
              activeOpacity={0.7}
              style={{ borderWidth: 1, borderColor: '#fecaca', borderRadius: 12, padding: 16, backgroundColor: '#fef2f2', gap: 8 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: '#111827', fontSize: 16 }}>{b.vrn}</Text>
                <View style={{ backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#b91c1c' }}>Repair needed</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, color: '#4b5563' }}>{b.fo}</Text>
              {b.repairReason && <Text style={{ fontSize: 13, color: '#991b1b' }}>{b.repairReason}</Text>}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <ChevronRight size={14} color="#dc2626" />
                <Text style={{ fontSize: 12, color: '#b91c1c' }}>Tap to enter new pairing code</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {activeBindings.length > 0 && (
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#15803d', textTransform: 'uppercase', letterSpacing: 1 }}>Active ({activeBindings.length})</Text>
          {activeBindings.map((b) => (
            <View key={b.id} style={{ borderWidth: 1, borderColor: '#d1fae5', borderRadius: 12, padding: 16, backgroundColor: '#f0fdf4', gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: '#111827', fontSize: 16 }}>{b.vrn}</Text>
                <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#15803d' }}>Active</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, color: '#4b5563' }}>{b.fo}</Text>
              {b.authMode === 'shift_based' && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} color="#6b7280" />
                  <Text style={{ fontSize: 13, color: '#4b5563' }}>{b.shiftDays?.join(', ')} · {b.shiftStart}–{b.shiftEnd}</Text>
                </View>
              )}
              {b.authMode === 'trip_linked' && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Route size={14} color="#6b7280" />
                  <Text style={{ fontSize: 13, color: '#4b5563' }}>{b.origin} → {b.destination}</Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>Balance</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>₹{b.balance?.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeBindings.length === 0 && pendingBindings.length === 0 && repairBindings.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <CheckCircle size={48} color="#d1d5db" />
          <Text style={{ fontWeight: '600', color: '#4b5563', marginTop: 16 }}>No assignments yet</Text>
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 4 }}>Your Fleet Operator will assign vehicles to you</Text>
        </View>
      )}
    </View>
  );
}
