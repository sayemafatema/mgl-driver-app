import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useMGL } from '../context/MGLContext';
import { MGLModal } from './MGLModal';

interface MGLLaunchButtonProps {
  label?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MGLLaunchButton({
  label = 'Open MGL Fleet Connect',
  style,
  textStyle,
}: MGLLaunchButtonProps) {
  const { open } = useMGL();

  return (
    <>
      <TouchableOpacity
        onPress={open}
        activeOpacity={0.8}
        style={[styles.button, style]}
      >
        <Text style={[styles.text, textStyle]}>{label}</Text>
      </TouchableOpacity>
      <MGLModal />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#15803d',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
