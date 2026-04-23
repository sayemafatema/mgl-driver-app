import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, Phone, ChevronRight } from 'lucide-react-native';
import { useMGLApp } from '../context/MGLContext';

export function ProfileScreen() {
  const { driver, pairedVehicles, handleLogout } = useMGLApp();

  return (
    <View style={{ padding: 16, gap: 20 }}>
      {/* Profile header */}
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 8 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#15803d' }}>{driver.initials}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>{driver.name}</Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>{driver.maskedMobile}</Text>
        </View>
      </View>

      {/* Account section */}
      <View style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12 }}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Account</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={18} color="#1d4ed8" />
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Mobile</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{driver.maskedMobile}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="#6b7280" />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>Change PIN</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Vehicles section */}
      {pairedVehicles.length > 0 && (
        <View style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>My Vehicles</Text>
          {pairedVehicles.map((v, i) => (
            <View key={i} style={{ paddingVertical: 12, borderBottomWidth: i < pairedVehicles.length - 1 ? 1 : 0, borderBottomColor: '#f3f4f6', gap: 4 }}>
              <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: '#111827', fontSize: 15 }}>{v.vrn}</Text>
              <Text style={{ fontSize: 13, color: '#4b5563' }}>{v.company}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>Balance: ₹{v.balance.toLocaleString('en-IN')}</Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>Limit: ₹{v.limit.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.7}
        style={{ borderWidth: 1, borderColor: '#fecaca', borderRadius: 12, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fef2f2' }}
      >
        <Text style={{ color: '#dc2626', fontWeight: '600' }}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
