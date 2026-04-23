import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Pressable } from 'react-native';
import { ChevronLeft, X, CheckCircle, Clock, MapPin } from 'lucide-react-native';
import { useMGLApp } from '../context/MGLContext';

export function PairingCodeScreen() {
  const {
    assignment, setCurrentMainScreen,
    pairingDigits, setPairingDigits, pairingAttempts, setPairingAttempts,
    pairingSuccess, setPairingSuccess, pairingError, setPairingError,
    pairingInputRefs, showPairingHelp, setShowPairingHelp,
    bindings,
  } = useMGLApp();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
        <TouchableOpacity
          onPress={() => setCurrentMainScreen('assignment_notification')}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <ChevronLeft size={20} color="#4b5563" />
          <Text style={{ color: '#4b5563' }}>Back</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>Enter pairing code</Text>

        <View style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, gap: 8 }}>
          <Text style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 18, color: '#111827' }}>{assignment.vrn}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {assignment.authMode === 'vehicle_linked' && <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start' }}><Text style={{ color: '#15803d', fontSize: 12, fontWeight: '700' }}>Vehicle-linked</Text></View>}
            {assignment.authMode === 'shift_based' && <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start' }}><Text style={{ color: '#b45309', fontSize: 12, fontWeight: '700' }}>Shift-based</Text></View>}
            {assignment.authMode === 'trip_linked' && <View style={{ backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start' }}><Text style={{ color: '#1d4ed8', fontSize: 12, fontWeight: '700' }}>Trip-linked</Text></View>}
          </View>
          <Text style={{ fontSize: 14, color: '#4b5563' }}>
            {assignment.authMode === 'vehicle_linked' && 'Permanent assignment'}
            {assignment.authMode === 'shift_based' && `Mon–Fri · ${assignment.shiftStart}–${assignment.shiftEnd}`}
            {assignment.authMode === 'trip_linked' && `Today · ${assignment.tripStart}–${assignment.tripEnd} · ${assignment.origin} → ${assignment.destination}`}
          </Text>
          <Text style={{ fontSize: 12, color: '#4b5563' }}>{assignment.fo}</Text>
        </View>

        <Text style={{ fontSize: 14, color: '#4b5563', textAlign: 'center' }}>Enter the 6-digit code your Fleet Operator shared with you</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
          {pairingDigits.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => { pairingInputRefs.current[i] = r; }}
              value={digit}
              onChangeText={(val) => {
                const v = val.replace(/[^0-9]/g, '');
                if (!v) return;
                const next = [...pairingDigits];
                next[i] = v.slice(-1);
                setPairingDigits(next);
                if (i < 5) pairingInputRefs.current[i + 1]?.focus();
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  const next = [...pairingDigits];
                  if (next[i]) { next[i] = ''; setPairingDigits(next); }
                  else if (i > 0) { pairingInputRefs.current[i - 1]?.focus(); }
                }
              }}
              keyboardType="numeric"
              maxLength={1}
              style={{ width: 44, height: 56, textAlign: 'center', fontSize: 20, fontFamily: 'monospace', fontWeight: '700', borderWidth: 2, borderRadius: 12, borderColor: digit ? '#22c55e' : '#d1d5db', backgroundColor: digit ? '#f0fdf4' : '#fff' }}
            />
          ))}
        </View>

        {pairingSuccess && (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <CheckCircle size={32} color="#16a34a" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#15803d' }}>Pairing successful!</Text>
            <Text style={{ fontSize: 14, color: '#4b5563' }}>Activating your assignment...</Text>
          </View>
        )}
        {pairingError && !pairingSuccess && (
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#dc2626' }}>{pairingError}</Text>
        )}

        {pairingAttempts >= 3 && (
          <View style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 12, padding: 16, gap: 8 }}>
            <Text style={{ fontWeight: '700', color: '#7f1d1d' }}>Too many attempts</Text>
            <Text style={{ fontSize: 14, color: '#991b1b' }}>Contact your Fleet Operator for a new code.</Text>
          </View>
        )}

        {pairingAttempts < 3 && !pairingSuccess && (
          <TouchableOpacity
            onPress={() => {
              const code = pairingDigits.join('');
              const validCode = assignment?.validPairingCode || bindings[3]?.validPairingCode;
              if (code === validCode) {
                setPairingSuccess(true);
                setTimeout(() => setCurrentMainScreen('assignment_accepted'), 1500);
              } else {
                const attempts = pairingAttempts + 1;
                setPairingAttempts(attempts);
                setPairingError('Incorrect code');
                setTimeout(() => { setPairingDigits(Array(6).fill('')); setPairingError(''); pairingInputRefs.current[0]?.focus(); }, 1500);
              }
            }}
            disabled={pairingDigits.some(d => d === '')}
            activeOpacity={0.7}
            style={{ backgroundColor: pairingDigits.some(d => d === '') ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Verify & Activate</Text>
          </TouchableOpacity>
        )}

        {pairingAttempts >= 3 && (
          <TouchableOpacity onPress={() => setCurrentMainScreen('home_empty')} activeOpacity={0.7} style={{ backgroundColor: '#d1d5db', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: '#374151', fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setShowPairingHelp(true)} activeOpacity={0.7}>
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#15803d', fontWeight: '600' }}>Haven't received your code?</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showPairingHelp} transparent animationType="slide" onRequestClose={() => setShowPairingHelp(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => setShowPairingHelp(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, gap: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Pairing code help</Text>
              <TouchableOpacity onPress={() => setShowPairingHelp(false)} activeOpacity={0.7}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 14, color: '#374151' }}>Ask your Fleet Operator to share the 6-digit pairing code for this assignment.</Text>
            <Text style={{ fontSize: 14, color: '#374151' }}>They can find it in the MGL Fleet portal under Driver Management.</Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
