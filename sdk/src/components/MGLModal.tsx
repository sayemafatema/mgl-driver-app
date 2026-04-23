import React, { useEffect } from 'react';
import { Modal } from 'react-native';
import { useMGL } from '../context/MGLContext';
import { MGLApp } from './MGLApp';

interface MGLModalProps {
  visible?: boolean;
  onClose?: () => void;
}

/**
 * MGLModal — advanced controlled variant.
 *
 * Uncontrolled (default):
 *   <MGLModal />  — visibility driven by MGLProvider internal state.
 *
 * Controlled:
 *   <MGLModal visible={open} onClose={() => setOpen(false)} />
 *   When onClose is provided it is registered as the close handler for ALL
 *   internal close actions (header X, logout, auth flows), so parent state
 *   stays in sync.
 */
export function MGLModal({ visible: visibleProp, onClose: onCloseProp }: MGLModalProps) {
  const { isOpen, close, closeRef } = useMGL();

  useEffect(() => {
    if (onCloseProp) {
      closeRef.current = onCloseProp;
      return () => { closeRef.current = null; };
    }
    return undefined;
  }, [onCloseProp]);

  const visible = visibleProp !== undefined ? visibleProp : isOpen;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={close}
    >
      <MGLApp />
    </Modal>
  );
}
