import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, QrCode, History, AlertCircle } from 'lucide-react-native';
import { useMGLApp } from '../context/MGLContext';

export function HomeScreen() {
  const {
    activeCards, activeCard, setActiveCard, currentCard, pendingAssignmentCount,
    setActiveTab, setSessionState, setActiveAssignment, setCurrentMainScreen,
    bindings, mockTransactions,
  } = useMGLApp();

  if (!currentCard) {
    return (
      <View style={{ padding: 24, alignItems: 'center', gap: 16, paddingTop: 48 }}>
        <QrCode size={48} color="#d1d5db" />
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#374151' }}>No active assignments</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>Accept an assignment to start using MGL Fleet Connect</Text>
        {pendingAssignmentCount > 0 && (
          <TouchableOpacity
            onPress={() => setActiveTab('assignments')}
            activeOpacity={0.7}
            style={{ backgroundColor: '#15803d', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>View pending assignments</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {pendingAssignmentCount > 0 && (
        <View style={{ backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={20} color="#d97706" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#78350f' }}>{pendingAssignmentCount} assignment{pendingAssignmentCount > 1 ? 's' : ''} need your attention</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveTab('assignments')} activeOpacity={0.7}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#15803d' }}>View</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Vehicle Card */}
      <View>
        <View style={{ backgroundColor: '#15803d', borderRadius: 16, overflow: 'hidden', minHeight: 160 }}>
          <View style={{ padding: 20, flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>{currentCard.fo}</Text>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>MGL</Text>
              </View>
            </View>
            <Text style={{ color: '#fff', fontFamily: 'monospace', fontWeight: '700', fontSize: 20, letterSpacing: 3, marginVertical: 12 }}>{activeCards[activeCard]?.vrn}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                  {currentCard.authMode === 'vehicle_linked' && 'Vehicle-linked'}
                  {currentCard.authMode === 'shift_based' && `Shift · ends ${currentCard.shiftEnd}`}
                  {currentCard.authMode === 'trip_linked' && `Trip · ends ${currentCard.tripEnd}`}
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                {currentCard.authMode === 'shift_based' && currentCard.shiftEndsIn}
                {currentCard.authMode === 'trip_linked' && `${currentCard.origin} → ${currentCard.destination}`}
              </Text>
            </View>
          </View>
        </View>
        {activeCards.length > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            {activeCards.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setActiveCard(i)} activeOpacity={0.7}>
                <View style={{ width: i === activeCard ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === activeCard ? '#16a34a' : '#d1d5db' }} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {activeCards.length > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            {activeCard > 0 ? (
              <TouchableOpacity onPress={() => setActiveCard(activeCard - 1)} activeOpacity={0.7} style={{ padding: 8 }}>
                <ChevronLeft size={20} color="#111827" />
              </TouchableOpacity>
            ) : <View style={{ width: 36 }} />}
            {activeCard < activeCards.length - 1 ? (
              <TouchableOpacity onPress={() => setActiveCard(activeCard + 1)} activeOpacity={0.7} style={{ padding: 8 }}>
                <ChevronRight size={20} color="#111827" />
              </TouchableOpacity>
            ) : <View style={{ width: 36 }} />}
          </View>
        )}
      </View>

      {/* Balance */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 11, color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }}>Vehicle Balance</Text>
        <Text style={{ fontSize: 36, fontWeight: '700', textAlign: 'center', marginTop: 4 }}>₹{activeCards[activeCard]?.balance?.toLocaleString('en-IN')}</Text>
        {(activeCards[activeCard]?.incentiveBalance ?? 0) > 0 && (
          <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 4 }}>
            Card ₹{activeCards[activeCard]?.cardBalance?.toLocaleString('en-IN')} · Incentive ₹{activeCards[activeCard]?.incentiveBalance?.toLocaleString('en-IN')}
          </Text>
        )}
        <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 2 }}>
          Spend limit ₹{activeCards[activeCard]?.spendLimit?.toLocaleString('en-IN')} per fueling
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity onPress={() => { setSessionState('scanning'); setActiveTab('scan'); }} activeOpacity={0.7} style={{ flex: 1, backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, alignItems: 'center', gap: 8 }}>
          <QrCode size={24} color="#15803d" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#15803d' }}>Scan & Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('transactions')} activeOpacity={0.7} style={{ flex: 1, backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, alignItems: 'center', gap: 8 }}>
          <History size={24} color="#6b7280" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#6b7280' }}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setActiveAssignment(bindings[3]); setCurrentMainScreen('assignment_notification'); }}
          activeOpacity={0.7}
          style={{ flex: 1, backgroundColor: '#fffbeb', borderRadius: 12, padding: 16, alignItems: 'center', gap: 8 }}
        >
          <AlertCircle size={24} color="#d97706" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#d97706' }}>Assign</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontWeight: '700', color: '#111827' }}>Recent transactions</Text>
          <TouchableOpacity onPress={() => setActiveTab('transactions')} activeOpacity={0.7}>
            <Text style={{ fontSize: 14, color: '#15803d', fontWeight: '600' }}>See all</Text>
          </TouchableOpacity>
        </View>
        {mockTransactions.slice(0, 3).map((txn) => (
          <View key={txn.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{txn.station}</Text>
              <Text style={{ fontSize: 12, color: '#4b5563' }}>{txn.date}</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: txn.type === 'Fueling' ? '#dc2626' : '#16a34a' }}>
              {txn.type === 'Fueling' ? '-' : '+'}₹{txn.amount}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
