import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { TextInput } from 'react-native';
import type {
  MGLConfig, Binding, Driver, Transaction, PairedVehicle, SessionState, TxnFilter,
} from '../types';
import { buildClient, MOCK_BINDINGS, MOCK_TRANSACTIONS, MOCK_PAIRED_VEHICLES, MOCK_DRIVER } from '../api/client';

// ── Public SDK context ────────────────────────────────────────────────────────

export interface MGLSdkContextValue {
  config: MGLConfig;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const MGLSdkContext = createContext<MGLSdkContextValue | null>(null);

export function useMGL(): MGLSdkContextValue {
  const ctx = useContext(MGLSdkContext);
  if (!ctx) throw new Error('useMGL must be used inside <MGLProvider>');
  return ctx;
}

// ── Internal app context ──────────────────────────────────────────────────────

export interface MGLAppContextValue {
  isAuthenticated: boolean;
  onAuthComplete: () => void;

  mobileNumber: string; setMobileNumber: (v: string) => void;
  inviteCode: string; setInviteCode: (v: string) => void;
  otp: string; setOtp: (v: string) => void;
  otpCountdown: number; setOtpCountdown: (v: number) => void;
  pin: string; setPin: (v: string) => void;
  pinConfirm: string; setPinConfirm: (v: string) => void;
  pinError: string; setPinError: (v: string) => void;
  loginPin: string; setLoginPin: (v: string) => void;
  loginPinError: string; setLoginPinError: (v: string) => void;
  wrongAttempts: number; setWrongAttempts: (v: number) => void;
  disableNumpad: boolean; setDisableNumpad: (v: boolean) => void;
  newPin: string; setNewPin: (v: string) => void;
  otpDigits: string[]; setOtpDigits: (v: string[]) => void;
  otpError: string; setOtpError: (v: string) => void;
  successToast: string | null; setSuccessToast: (v: string | null) => void;

  txnFilter: TxnFilter; setTxnFilter: (v: TxnFilter) => void;
  activeCard: number; setActiveCard: (v: number) => void;
  expandPastAssignments: boolean; setExpandPastAssignments: (v: boolean) => void;
  sessionState: SessionState; setSessionState: (v: SessionState) => void;
  sessionPin: string; setSessionPin: (v: string) => void;
  sessionOtp: string; setSessionOtp: (v: string) => void;
  dispensingAmount: number; setDispensingAmount: (v: number) => void;
  activeScanBinding: Binding | null; setActiveScanBinding: (v: Binding | null) => void;
  selectedScanBinding: Binding | null; setSelectedScanBinding: (v: Binding | null) => void;
  activeAssignment: Binding | null; setActiveAssignment: (v: Binding | null) => void;
  pairingDigits: string[]; setPairingDigits: (v: string[]) => void;
  pairingAttempts: number; setPairingAttempts: (v: number) => void;
  pairingSuccess: boolean; setPairingSuccess: (v: boolean) => void;
  pairingError: string; setPairingError: (v: string) => void;
  showDeclineConfirm: boolean; setShowDeclineConfirm: (v: boolean) => void;
  showPairingHelp: boolean; setShowPairingHelp: (v: boolean) => void;
  declineBndId: string | null; setDeclineBndId: (v: string | null) => void;

  loginOtpRefs: React.MutableRefObject<(TextInput | null)[]>;
  onboardingOtpRefs: React.MutableRefObject<(TextInput | null)[]>;
  resetOtpRefs: React.MutableRefObject<(TextInput | null)[]>;
  sessionOtpRefs: React.MutableRefObject<(TextInput | null)[]>;
  pairingInputRefs: React.MutableRefObject<(TextInput | null)[]>;

  bindings: Binding[];
  driver: Driver;
  pairedVehicles: PairedVehicle[];
  mockTransactions: Transaction[];

  activeCards: Binding[];
  currentCard: Binding | undefined;
  pendingAssignmentCount: number;
  activeBindings: Binding[];
  pendingBindings: Binding[];
  repairBindings: Binding[];
  assignment: Binding;

  handleSessionPinInput: (d: string) => void;
  handleSessionPinBackspace: () => void;
  handleLogout: () => void;
  onClose: () => void;
}

const MGLAppContext = createContext<MGLAppContextValue | null>(null);

export function useMGLApp(): MGLAppContextValue {
  const ctx = useContext(MGLAppContext);
  if (!ctx) throw new Error('useMGLApp must be used inside <MGLProvider>');
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function MGLProvider({ children, config = {} }: { children: ReactNode; config?: MGLConfig }) {
  const client = buildClient(config);

  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [mobileNumber, setMobileNumber] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [otp, setOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginPinError, setLoginPinError] = useState('');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [disableNumpad, setDisableNumpad] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [txnFilter, setTxnFilter] = useState<TxnFilter>('all');
  const [activeCard, setActiveCard] = useState(0);
  const [expandPastAssignments, setExpandPastAssignments] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [sessionPin, setSessionPin] = useState('');
  const [sessionOtp, setSessionOtp] = useState('');
  const [dispensingAmount, setDispensingAmount] = useState(0);
  const [activeScanBinding, setActiveScanBinding] = useState<Binding | null>(null);
  const [selectedScanBinding, setSelectedScanBinding] = useState<Binding | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Binding | null>(null);
  const [pairingDigits, setPairingDigits] = useState(Array(6).fill(''));
  const [pairingAttempts, setPairingAttempts] = useState(0);
  const [pairingSuccess, setPairingSuccess] = useState(false);
  const [pairingError, setPairingError] = useState('');
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [showPairingHelp, setShowPairingHelp] = useState(false);
  const [declineBndId, setDeclineBndId] = useState<string | null>(null);

  const [bindings, setBindings] = useState<Binding[]>(MOCK_BINDINGS);
  const [driver, setDriver] = useState<Driver>(MOCK_DRIVER);
  const [pairedVehicles, setPairedVehicles] = useState<PairedVehicle[]>(MOCK_PAIRED_VEHICLES);
  const [mockTransactions, setMockTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  useEffect(() => {
    if (isAuthenticated && !config.mockMode && config.baseUrl) {
      Promise.all([
        client.getBindings().then(setBindings).catch(() => {}),
        client.getDriver().then(setDriver).catch(() => {}),
        client.getPairedVehicles().then(setPairedVehicles).catch(() => {}),
        client.getTransactions().then(setMockTransactions).catch(() => {}),
      ]);
    }
  }, [isAuthenticated, config.mockMode, config.baseUrl]);

  const loginOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const onboardingOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const resetOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const sessionOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const pairingInputRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const activeCards = bindings.filter(b => b.paired && b.state === 'ACTIVE');
  const currentCard = activeCards[activeCard];
  const pendingAssignmentCount = bindings.filter(b =>
    b.state === 'PENDING_ACCEPTANCE' || (!b.paired && b.state === 'ACTIVE')
  ).length;
  const activeBindings = bindings.filter(b => b.paired && b.state === 'ACTIVE');
  const pendingBindings = bindings.filter(b => b.state === 'PENDING_ACCEPTANCE');
  const repairBindings = bindings.filter(b => !b.paired && b.state === 'ACTIVE');
  const assignment = activeAssignment ?? bindings.find(b => b.state === 'PENDING_ACCEPTANCE') ?? bindings[3];

  function handleSessionPinInput(d: string) {
    if (sessionPin.length < 6) setSessionPin(sessionPin + d);
  }

  function handleSessionPinBackspace() { setSessionPin(sessionPin.slice(0, -1)); }

  function handleLogout() {
    setIsAuthenticated(false);
    setMobileNumber('');
    setInviteCode('');
    setPin('');
    setPinConfirm('');
    setLoginPin('');
    setLoginPinError('');
    setWrongAttempts(0);
    setDisableNumpad(false);
    setOtpDigits(Array(6).fill(''));
    setOtpError('');
    setSessionState('idle');
    close();
  }

  function onAuthComplete() { setIsAuthenticated(true); }

  const sdkValue: MGLSdkContextValue = { config, isOpen, open, close };

  const appValue: MGLAppContextValue = {
    isAuthenticated, onAuthComplete,
    mobileNumber, setMobileNumber, inviteCode, setInviteCode,
    otp, setOtp, otpCountdown, setOtpCountdown,
    pin, setPin, pinConfirm, setPinConfirm, pinError, setPinError,
    loginPin, setLoginPin, loginPinError, setLoginPinError,
    wrongAttempts, setWrongAttempts, disableNumpad, setDisableNumpad,
    newPin, setNewPin, otpDigits, setOtpDigits, otpError, setOtpError,
    successToast, setSuccessToast,
    txnFilter, setTxnFilter, activeCard, setActiveCard,
    expandPastAssignments, setExpandPastAssignments,
    sessionState, setSessionState, sessionPin, setSessionPin,
    sessionOtp, setSessionOtp, dispensingAmount, setDispensingAmount,
    activeScanBinding, setActiveScanBinding, selectedScanBinding, setSelectedScanBinding,
    activeAssignment, setActiveAssignment,
    pairingDigits, setPairingDigits, pairingAttempts, setPairingAttempts,
    pairingSuccess, setPairingSuccess, pairingError, setPairingError,
    showDeclineConfirm, setShowDeclineConfirm, showPairingHelp, setShowPairingHelp,
    declineBndId, setDeclineBndId,
    loginOtpRefs, onboardingOtpRefs, resetOtpRefs, sessionOtpRefs, pairingInputRefs,
    bindings, driver, pairedVehicles, mockTransactions,
    activeCards, currentCard, pendingAssignmentCount,
    activeBindings, pendingBindings, repairBindings, assignment,
    handleSessionPinInput, handleSessionPinBackspace, handleLogout, onClose: close,
  };

  return (
    <MGLSdkContext.Provider value={sdkValue}>
      <MGLAppContext.Provider value={appValue}>
        {children}
      </MGLAppContext.Provider>
    </MGLSdkContext.Provider>
  );
}
