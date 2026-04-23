import React from 'react';
import { View } from 'react-native';

interface PinDisplayProps {
  value: string;
  error?: boolean;
}

export function PinDisplay({ value, error }: PinDisplayProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 24 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 16, height: 16, borderRadius: 8, borderWidth: 2,
            backgroundColor: i < value.length ? (error ? '#ef4444' : '#15803d') : 'transparent',
            borderColor: i < value.length ? (error ? '#ef4444' : '#15803d') : '#d1d5db',
          }}
        />
      ))}
    </View>
  );
}
