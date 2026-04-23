import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { QrCode, CheckCircle, Lock } from 'lucide-react-native';
import { Svg, Rect, Line } from 'react-native-svg';
import { useMGLApp } from '../context/MGLContext';
import { Numpad } from '../components/Numpad';
import { PinDisplay } from '../components/PinDisplay';

export function ScanScreen() {
  const {
    bindings, selectedScanBinding, setSelectedScanBinding,
    sessionState, setSessionState, sessionPin, setSessionPin,
    sessionOtp, setSessionOtp, dispensingAmount, setDispensingAmount,
    activeScanBinding, setActiveScanBinding,
    sessionOtpRefs, handleSessionPinInput, handleSessionPinBackspace,
  } = useMGLApp();

  const scanBindings = bindings.filter(b => b.scanPayStatus === 'always_available' || b.scanPayStatus === 'in_window');

  if (scanBindings.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 48, padding: 16 }}>
        <QrCode size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
        <Text style={{ fontWeight: '600', color: '#4b5563', marginBottom: 4 }}>No vehicles available for scan</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>Accept an assignment and complete pairing to enable Scan & Pay</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Scan & Pay</Text>

      {/* Vehicle selector */}
      <View style={{ gap: 8 }}>
        {scanBindings.map((b) => (
          <TouchableOpacity
            key={b.id}
            onPress={() => setSelectedScanBinding(b)}
            activeOpacity={0.7}
            style={{ borderWidth: 2, borderColor: selectedScanBinding?.id === b.id ? '#15803d' : '#e5e7eb', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: selectedScanBinding?.id === b.id ? '#f0fdf4' : '#fff' }}
          >
            <View>
              <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: '#111827' }}>{b.vrn}</Text>
              <Text style={{ fontSize: 12, color: '#4b5563' }}>{b.fo}</Text>
            </View>
            <View style={{ backgroundColor: b.scanPayStatus === 'always_available' ? '#dcfce7' : '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: b.scanPayStatus === 'always_available' ? '#15803d' : '#b45309' }}>
                {b.scanPayStatus === 'always_available' ? 'Always' : 'In window'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedScanBinding && sessionState === 'idle' && (
        <TouchableOpacity
          onPress={() => { setActiveScanBinding(selectedScanBinding); setSessionState('scanning'); }}
          activeOpacity={0.7}
          style={{ backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 16, alignItems: 'center', gap: 8 }}
        >
          <QrCode size={32} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Scan QR Code</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Point camera at station QR code</Text>
        </TouchableOpacity>
      )}

      {/* Scanning */}
      {sessionState === 'scanning' && (
        <View style={{ gap: 16 }}>
          <View style={{ aspectRatio: 1, backgroundColor: '#111827', borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
            <Svg width="200" height="200" viewBox="0 0 200 200">
              <Rect x="40" y="40" width="50" height="50" fill="none" stroke="white" strokeWidth="3" />
              <Rect x="110" y="40" width="50" height="50" fill="none" stroke="white" strokeWidth="3" />
              <Rect x="40" y="110" width="50" height="50" fill="none" stroke="white" strokeWidth="3" />
              <Line x1="60" y1="95" x2="60" y2="105" stroke="#22c55e" strokeWidth="2" />
              <Line x1="100" y1="95" x2="100" y2="105" stroke="#22c55e" strokeWidth="2" />
              <Line x1="140" y1="95" x2="140" y2="105" stroke="#22c55e" strokeWidth="2" />
            </Svg>
          </View>
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#6b7280' }}>Scanning at MGL CNG Station...</Text>
          <TouchableOpacity
            onPress={() => { setSessionPin(''); setSessionState('confirmation'); }}
            activeOpacity={0.7}
            style={{ backgroundColor: '#15803d', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Simulate scan success</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSessionState('idle')} activeOpacity={0.7} style={{ paddingVertical: 8, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PIN confirmation */}
      {sessionState === 'confirmation' && (
        <View style={{ gap: 8 }}>
          <View style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, gap: 8 }}>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Fueling at</Text>
            <Text style={{ fontWeight: '700', color: '#111827' }}>MGL Hind CNG Filling · Bhandup West</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Vehicle: {activeScanBinding?.vrn}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Pre-auth limit</Text>
              <Text style={{ fontWeight: '700', color: '#111827' }}>₹{activeScanBinding?.spendLimit?.toLocaleString('en-IN')}</Text>
            </View>
          </View>
          <Text style={{ fontWeight: '700', color: '#111827', textAlign: 'center', marginTop: 8 }}>Confirm with your PIN</Text>
          <PinDisplay value={sessionPin} />
          <Numpad onPress={handleSessionPinInput} onBackspace={handleSessionPinBackspace} />
          {sessionPin.length === 6 && (
            <TouchableOpacity
              onPress={() => {
                if (sessionPin === '123456') { setSessionState('authorized'); setDispensingAmount(1200); }
                else { setSessionPin(''); }
              }}
              activeOpacity={0.7}
              style={{ backgroundColor: '#15803d', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Authorize ₹{activeScanBinding?.spendLimit?.toLocaleString('en-IN')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setSessionState('idle')} activeOpacity={0.7} style={{ paddingVertical: 8, alignItems: 'center' }}>
            <Text style={{ color: '#dc2626' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Authorized / Dispensing */}
      {sessionState === 'authorized' && (
        <View style={{ alignItems: 'center', gap: 16 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={40} color="#16a34a" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#15803d' }}>Payment authorized</Text>
          <View style={{ backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#93c5fd', borderRadius: 12, padding: 16, width: '100%', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' }} />
              <Text style={{ fontWeight: '600', color: '#1e40af' }}>Fueling in progress</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#1e40af' }}>Authorized up to ₹{dispensingAmount.toLocaleString('en-IN')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setSessionState('complete')}
            activeOpacity={0.7}
            style={{ backgroundColor: '#15803d', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Simulate fueling complete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Complete */}
      {sessionState === 'complete' && (
        <View style={{ alignItems: 'center', gap: 16 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={40} color="#16a34a" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#15803d' }}>Fueling complete!</Text>
          <View style={{ backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 12, padding: 16, width: '100%', gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>Amount charged</Text>
              <Text style={{ fontWeight: '700', color: '#111827' }}>₹672</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>CNG dispensed</Text>
              <Text style={{ fontWeight: '700', color: '#111827' }}>4.2 kg</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>Station</Text>
              <Text style={{ fontWeight: '700', color: '#111827' }}>MGL Hind CNG</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => { setSessionState('idle'); setSessionPin(''); setDispensingAmount(0); }}
            activeOpacity={0.7}
            style={{ backgroundColor: '#15803d', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
