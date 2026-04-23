import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface NumpadProps {
  onPress: (digit: string) => void;
  onBackspace: () => void;
  isConfirm?: boolean;
}

export function Numpad({ onPress, onBackspace }: NumpadProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => onPress(n.toString())}
          activeOpacity={0.7}
          style={{ width: '30%', backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}
        >
          <Text style={{ fontWeight: '600', color: '#111827', fontSize: 18 }}>{n}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={onBackspace}
        activeOpacity={0.7}
        style={{ width: '63%', backgroundColor: '#fee2e2', borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}
      >
        <Text style={{ color: '#b91c1c' }}>← Backspace</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress('0')}
        activeOpacity={0.7}
        style={{ width: '30%', backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}
      >
        <Text style={{ fontWeight: '600', color: '#111827', fontSize: 18 }}>0</Text>
      </TouchableOpacity>
    </View>
  );
}
