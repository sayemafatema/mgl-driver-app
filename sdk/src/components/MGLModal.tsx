import React from 'react';
import { Modal } from 'react-native';
import { useMGL } from '../context/MGLContext';
import { MGLApp } from './MGLApp';

export function MGLModal() {
  const { isOpen, close } = useMGL();

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={close}
    >
      <MGLApp onClose={close} />
    </Modal>
  );
}
