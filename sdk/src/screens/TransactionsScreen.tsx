import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useMGLApp } from '../context/MGLContext';

export function TransactionsScreen() {
  const { mockTransactions, txnFilter, setTxnFilter } = useMGLApp();

  const filtered = txnFilter === 'all' ? mockTransactions
    : txnFilter === 'successful' ? mockTransactions.filter(t => t.status === 'Success')
    : mockTransactions.filter(t => t.status !== 'Success');

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Transactions</Text>

      {/* Filter pills */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['all', 'successful', 'failed'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setTxnFilter(f)}
            activeOpacity={0.7}
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99, borderWidth: 1, borderColor: txnFilter === f ? '#15803d' : '#d1d5db', backgroundColor: txnFilter === f ? '#f0fdf4' : '#fff' }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: txnFilter === f ? '#15803d' : '#6b7280', textTransform: 'capitalize' }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <Text style={{ fontWeight: '600', color: '#4b5563' }}>No transactions found</Text>
        </View>
      ) : (
        <View style={{ gap: 2 }}>
          {filtered.map((txn) => (
            <View key={txn.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{txn.station}</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>{txn.date}</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>·</Text>
                  <Text style={{ fontSize: 12, fontFamily: 'monospace', color: '#6b7280' }}>{txn.vrn}</Text>
                  {txn.quantity && (
                    <>
                      <Text style={{ fontSize: 12, color: '#6b7280' }}>·</Text>
                      <Text style={{ fontSize: 12, color: '#6b7280' }}>{txn.quantity}</Text>
                    </>
                  )}
                </View>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: txn.type === 'Fueling' ? '#dc2626' : '#16a34a' }}>
                  {txn.type === 'Fueling' ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                </Text>
                <View style={{ backgroundColor: txn.status === 'Success' ? '#dcfce7' : '#fee2e2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: txn.status === 'Success' ? '#15803d' : '#dc2626' }}>{txn.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
