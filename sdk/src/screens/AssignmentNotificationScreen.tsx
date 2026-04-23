import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { ChevronLeft, Clock, MapPin, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useMGLApp } from '../context/MGLContext';
import type { MainStackParamList } from '../types';

type Nav = StackNavigationProp<MainStackParamList, 'AssignmentNotification'>;

export function AssignmentNotificationScreen() {
  const navigation = useNavigation<Nav>();
  const {
    assignment, setActiveAssignment,
    showDeclineConfirm, setShowDeclineConfirm, setDeclineBndId,
  } = useMGLApp();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
        <TouchableOpacity
          onPress={() => { setActiveAssignment(null); navigation.goBack(); }}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <ChevronLeft size={20} color="#4b5563" />
          <Text style={{ color: '#4b5563' }}>Back</Text>
        </TouchableOpacity>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>New assignment</Text>
          <Text style={{ fontSize: 14, color: '#4b5563' }}>Review the details before accepting</Text>
        </View>

        <View style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
          <View style={{ backgroundColor: '#111827', padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Vehicle</Text>
              <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#78350f' }}>Pending acceptance</Text>
              </View>
            </View>
            <Text style={{ color: '#fff', fontFamily: 'monospace', fontWeight: '700', fontSize: 22, letterSpacing: 3, marginTop: 8 }}>{assignment.vrn}</Text>
          </View>

          <View style={{ padding: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>Fleet Operator</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{assignment.fo}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>Assigned by</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{assignment.assignedBy || 'Fleet Manager'}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />
            {assignment.authMode === 'vehicle_linked' && (
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}><AlertCircle size={18} color="#15803d" /></View>
                <View style={{ flex: 1 }}><Text style={{ fontWeight: '600', color: '#111827' }}>Vehicle-linked</Text><Text style={{ fontSize: 14, color: '#4b5563', marginTop: 2 }}>Permanent assignment. Scan & Pay always available.</Text></View>
              </View>
            )}
            {assignment.authMode === 'shift_based' && (
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' }}><Clock size={18} color="#d97706" /></View>
                <View style={{ flex: 1 }}><Text style={{ fontWeight: '600', color: '#111827' }}>Shift-based</Text><Text style={{ fontSize: 14, color: '#4b5563', marginTop: 2 }}>{assignment.shiftDays?.join(', ')} · {assignment.shiftStart}–{assignment.shiftEnd}</Text></View>
              </View>
            )}
            {assignment.authMode === 'trip_linked' && (
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' }}><MapPin size={18} color="#1d4ed8" /></View>
                <View style={{ flex: 1 }}><Text style={{ fontWeight: '600', color: '#111827' }}>Trip-linked</Text><Text style={{ fontSize: 14, color: '#4b5563', marginTop: 2 }}>{assignment.tripDate} · {assignment.tripStart}–{assignment.tripEnd}</Text><Text style={{ fontSize: 14, color: '#4b5563' }}>{assignment.origin} → {assignment.destination}</Text></View>
              </View>
            )}
            <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>Spend limit per fueling</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>₹{assignment.spendLimit?.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PairingCode', { bindingId: assignment.id })}
            activeOpacity={0.7}
            style={{ backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Accept & Pair</Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>You'll enter a 6-digit pairing code next</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setDeclineBndId(assignment.id); setShowDeclineConfirm(true); }}
            activeOpacity={0.7}
            style={{ borderWidth: 1, borderColor: '#fecaca', borderRadius: 16, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fef2f2' }}
          >
            <Text style={{ color: '#dc2626', fontWeight: '600' }}>Decline assignment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showDeclineConfirm} transparent animationType="slide" onRequestClose={() => setShowDeclineConfirm(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setShowDeclineConfirm(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Decline this assignment?</Text>
            <Text style={{ fontSize: 14, color: '#4b5563' }}>Your Fleet Operator will be notified. This action cannot be undone.</Text>
            <TouchableOpacity
              onPress={() => { setShowDeclineConfirm(false); setActiveAssignment(null); navigation.popToTop(); }}
              activeOpacity={0.7}
              style={{ backgroundColor: '#dc2626', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Yes, decline</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDeclineConfirm(false)} activeOpacity={0.7} style={{ paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#374151', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
