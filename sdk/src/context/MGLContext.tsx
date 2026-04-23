import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MGLConfig {
  baseUrl?: string;
  apiKey?: string;
  mockMode?: boolean;
  theme?: {
    primaryColor?: string;
    logoSource?: number;
  };
}

interface MGLContextValue {
  config: MGLConfig;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const MGLContext = createContext<MGLContextValue | null>(null);

export function MGLProvider({ children, config = {} }: { children: ReactNode; config?: MGLConfig }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <MGLContext.Provider value={{ config, isOpen, open, close }}>
      {children}
    </MGLContext.Provider>
  );
}

export function useMGL(): MGLContextValue {
  const ctx = useContext(MGLContext);
  if (!ctx) {
    throw new Error('useMGL must be used inside <MGLProvider>');
  }
  return ctx;
}
