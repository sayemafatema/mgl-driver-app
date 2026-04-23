import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CheckCircle, Clock, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useMGLApp } from '../context/MGLContext';
import type { MainStackParamList } from '../types';

type Nav = StackNavigationProp<MainStackParamList, 'AssignmentAccepted'>;

export function AssignmentAcceptedScreen() {
  const navigation = useNavigation<Nav>();
  const { assignment, setActiveAssignment } = useMGLApp();

  return (
    <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24, backgroundColor: '#f0fdf4' }}>
      <CheckCircle size={80} color="#16a34a" />
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#15803d', textAlign: 'center' }}>Assignment activated!</Text>
      <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99 }}>
        <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: '#15803d', fontSize: 16 }}>{assignment.vrn}</Text>
      </View>

      <View style={{ width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, gap: 12, marginTop: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>What's now unlocked</Text>
        {assignment.authMode === 'vehicle_linked' && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <CheckCircle size={20} color="#16a34a" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: '#111827' }}>Scan & Pay always available</Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>You can fuel {assignment.vrn} at any MGL CNG station at any time</Text>
            </View>
          </View>
        )}
        {assignment.authMode === 'shift_based' && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Clock size={20} color="#d97706" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: '#111827' }}>Scan & Pay within shift hours</Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>Mon–Fri · {assignment.shiftStart}–{assignment.shiftEnd}</Text>
            </View>
          </View>
        )}
        {assignment.authMode === 'trip_linked' && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <MapPin size={20} color="#2563eb" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: '#111827' }}>Scan & Pay until {assignment.tripEnd} today</Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>{assignment.origin} → {assignment.destination}</Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => { setActiveAssignment(null); navigation.navigate('Tabs', { screen: 'Assignments' }); }}
        activeOpacity={0.7}
        style={{ width: '100%', backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 16 }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Go to My Assignments</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
