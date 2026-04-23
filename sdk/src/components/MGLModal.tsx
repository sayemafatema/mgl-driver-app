import React from 'react';
import { Modal } from 'react-native';
import { useMGL } from '../context/MGLContext';
import { MGLApp } from './MGLApp';

interface MGLModalProps {
  visible?: boolean;
  onClose?: () => void;
}

export function MGLModal({ visible: visibleProp, onClose: onCloseProp }: MGLModalProps) {
  const { isOpen, close } = useMGL();

  const visible = visibleProp !== undefined ? visibleProp : isOpen;
  const handleClose = onCloseProp ?? close;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <MGLApp />
    </Modal>
  );
}
