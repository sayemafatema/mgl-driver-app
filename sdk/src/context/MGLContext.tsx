import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { TextInput } from 'react-native';
import type {
  MGLConfig, Binding, Driver, Transaction, PairedVehicle,
  OnboardingStep, ActiveTab, MainScreen, SessionState, TxnFilter,
} from '../types';
import { buildClient, MOCK_BINDINGS, MOCK_TRANSACTIONS, MOCK_PAIRED_VEHICLES, MOCK_DRIVER } from '../api/client';

// ── Public SDK context (for host app) ─────────────────────────────────────────

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

// ── Internal app context (for SDK screens) ────────────────────────────────────

export interface MGLAppContextValue {
  onboardingStep: OnboardingStep;
  setOnboardingStep: (v: OnboardingStep) => void;
  mobileNumber: string;
  setMobileNumber: (v: string) => void;
  inviteCode: string;
  setInviteCode: (v: string) => void;
  otp: string;
  setOtp: (v: string) => void;
  otpCountdown: number;
  setOtpCountdown: (v: number) => void;
  pin: string;
  setPin: (v: string) => void;
  pinConfirm: string;
  setPinConfirm: (v: string) => void;
  pinError: string;
  setPinError: (v: string) => void;
  loginPin: string;
  setLoginPin: (v: string) => void;
  loginPinError: string;
  setLoginPinError: (v: string) => void;
  wrongAttempts: number;
  setWrongAttempts: (v: number) => void;
  disableNumpad: boolean;
  setDisableNumpad: (v: boolean) => void;
  showShake: boolean;
  setShowShake: (v: boolean) => void;
  newPin: string;
  setNewPin: (v: string) => void;
  isNewUser: boolean;
  setIsNewUser: (v: boolean) => void;
  otpDigits: string[];
  setOtpDigits: (v: string[]) => void;
  otpError: string;
  setOtpError: (v: string) => void;
  successToast: string | null;
  setSuccessToast: (v: string | null) => void;
  activeTab: ActiveTab;
  setActiveTab: (v: ActiveTab) => void;
  txnFilter: TxnFilter;
  setTxnFilter: (v: TxnFilter) => void;
  currentMainScreen: MainScreen;
  setCurrentMainScreen: (v: MainScreen) => void;
  activeCard: number;
  setActiveCard: (v: number) => void;
  expandPastAssignments: boolean;
  setExpandPastAssignments: (v: boolean) => void;
  sessionState: SessionState;
  setSessionState: (v: SessionState) => void;
  sessionPin: string;
  setSessionPin: (v: string) => void;
  sessionOtp: string;
  setSessionOtp: (v: string) => void;
  dispensingAmount: number;
  setDispensingAmount: (v: number) => void;
  activeScanBinding: Binding | null;
  setActiveScanBinding: (v: Binding | null) => void;
  selectedScanBinding: Binding | null;
  setSelectedScanBinding: (v: Binding | null) => void;
  activeAssignment: Binding | null;
  setActiveAssignment: (v: Binding | null) => void;
  pairingDigits: string[];
  setPairingDigits: (v: string[]) => void;
  pairingAttempts: number;
  setPairingAttempts: (v: number) => void;
  pairingSuccess: boolean;
  setPairingSuccess: (v: boolean) => void;
  pairingError: string;
  setPairingError: (v: string) => void;
  showDeclineConfirm: boolean;
  setShowDeclineConfirm: (v: boolean) => void;
  showPairingHelp: boolean;
  setShowPairingHelp: (v: boolean) => void;
  showShiftSchedule: boolean;
  setShowShiftSchedule: (v: boolean) => void;
  selectedShiftBinding: Binding | null;
  setSelectedShiftBinding: (v: Binding | null) => void;
  showTripDetails: boolean;
  setShowTripDetails: (v: boolean) => void;
  selectedTripBinding: Binding | null;
  setSelectedTripBinding: (v: Binding | null) => void;
  declineBndId: string | null;
  setDeclineBndId: (v: string | null) => void;
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
  handlePinInput: (digit: string, isConfirm?: boolean) => void;
  handlePinBackspace: (isConfirm?: boolean) => void;
  handleSessionPinInput: (digit: string) => void;
  handleSessionPinBackspace: () => void;
  handleLoginOtpVerify: () => void;
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

  // Auth state
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('login');
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
  const [showShake, setShowShake] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Main app state
  const [activeTab, setActiveTab] = useState<ActiveTab>('card');
  const [txnFilter, setTxnFilter] = useState<TxnFilter>('all');
  const [currentMainScreen, setCurrentMainScreen] = useState<MainScreen>('home_empty');
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
  const [showShiftSchedule, setShowShiftSchedule] = useState(false);
  const [selectedShiftBinding, setSelectedShiftBinding] = useState<Binding | null>(null);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [selectedTripBinding, setSelectedTripBinding] = useState<Binding | null>(null);
  const [declineBndId, setDeclineBndId] = useState<string | null>(null);

  // Data state — seeded from mock, replaced via API when real mode
  const [bindings, setBindings] = useState<Binding[]>(MOCK_BINDINGS);
  const [driver, setDriver] = useState<Driver>(MOCK_DRIVER);
  const [pairedVehicles, setPairedVehicles] = useState<PairedVehicle[]>(MOCK_PAIRED_VEHICLES);
  const [mockTransactions, setMockTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Load real data when authenticated (non-mock mode)
  useEffect(() => {
    if (onboardingStep === 'complete' && !config.mockMode && config.baseUrl) {
      Promise.all([
        client.getBindings().then(setBindings).catch(() => {}),
        client.getDriver().then(setDriver).catch(() => {}),
        client.getPairedVehicles().then(setPairedVehicles).catch(() => {}),
        client.getTransactions().then(setMockTransactions).catch(() => {}),
      ]);
    }
  }, [onboardingStep, config.mockMode, config.baseUrl]);

  // Refs
  const loginOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const onboardingOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const resetOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const sessionOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const pairingInputRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);

  // Derived
  const activeCards = bindings.filter(b => b.paired && b.state === 'ACTIVE');
  const currentCard = activeCards[activeCard];
  const pendingAssignmentCount = bindings.filter(b =>
    b.state === 'PENDING_ACCEPTANCE' || (!b.paired && b.state === 'ACTIVE')
  ).length;
  const activeBindings = bindings.filter(b => b.paired && b.state === 'ACTIVE');
  const pendingBindings = bindings.filter(b => b.state === 'PENDING_ACCEPTANCE');
  const repairBindings = bindings.filter(b => !b.paired && b.state === 'ACTIVE');
  const assignment = activeAssignment ?? bindings.find(b => b.state === 'PENDING_ACCEPTANCE') ?? bindings[3];

  // Init selected scan binding
  useEffect(() => {
    const first = bindings.find(
      b => b.scanPayStatus === 'always_available' || b.scanPayStatus === 'in_window'
    ) ?? null;
    setSelectedScanBinding(first);
  }, []);

  // OTP countdown
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Auto-verify OTP on login
  useEffect(() => {
    if (otpDigits.join('').length === 6 && onboardingStep === 'login_otp') {
      handleLoginOtpVerify();
    }
  }, [otpDigits, onboardingStep]);

  // Focus pairing input on screen change
  useEffect(() => {
    if (currentMainScreen === 'pairing_code') {
      setPairingDigits(['', '', '', '', '', '']);
      setTimeout(() => { pairingInputRefs.current[0]?.focus(); }, 100);
    }
  }, [currentMainScreen]);

  function handlePinInput(digit: string, isConfirm = false) {
    if (isConfirm) { if (pinConfirm.length < 6) setPinConfirm(pinConfirm + digit); }
    else { if (pin.length < 6) setPin(pin + digit); }
  }

  function handlePinBackspace(isConfirm = false) {
    if (isConfirm) setPinConfirm(pinConfirm.slice(0, -1));
    else setPin(pin.slice(0, -1));
  }

  function handleSessionPinInput(digit: string) {
    if (sessionPin.length < 6) setSessionPin(sessionPin + digit);
  }

  function handleSessionPinBackspace() { setSessionPin(sessionPin.slice(0, -1)); }

  function handleLoginOtpVerify() {
    const entered = otpDigits.join('');
    if (entered === '123456') {
      setLoginPin('');
      setLoginPinError('');
      setWrongAttempts(0);
      setDisableNumpad(false);
      setOnboardingStep('pin_login');
    } else {
      setOtpError('Incorrect OTP. Try again.');
      setTimeout(() => { setOtpDigits(Array(6).fill('')); setOtpError(''); }, 1500);
    }
  }

  function handleLogout() {
    setOnboardingStep('login');
    setInviteCode('');
    setMobileNumber('');
    setOtp('');
    setPin('');
    setPinConfirm('');
    setLoginPin('');
    setLoginPinError('');
    setWrongAttempts(0);
    setDisableNumpad(false);
    setOtpDigits(Array(6).fill(''));
    setOtpError('');
    setActiveTab('card');
    setCurrentMainScreen('home_empty');
    setSessionState('idle');
    close();
  }

  const sdkValue: MGLSdkContextValue = { config, isOpen, open, close };

  const appValue: MGLAppContextValue = {
    onboardingStep, setOnboardingStep,
    mobileNumber, setMobileNumber,
    inviteCode, setInviteCode,
    otp, setOtp,
    otpCountdown, setOtpCountdown,
    pin, setPin,
    pinConfirm, setPinConfirm,
    pinError, setPinError,
    loginPin, setLoginPin,
    loginPinError, setLoginPinError,
    wrongAttempts, setWrongAttempts,
    disableNumpad, setDisableNumpad,
    showShake, setShowShake,
    newPin, setNewPin,
    isNewUser, setIsNewUser,
    otpDigits, setOtpDigits,
    otpError, setOtpError,
    successToast, setSuccessToast,
    activeTab, setActiveTab,
    txnFilter, setTxnFilter,
    currentMainScreen, setCurrentMainScreen,
    activeCard, setActiveCard,
    expandPastAssignments, setExpandPastAssignments,
    sessionState, setSessionState,
    sessionPin, setSessionPin,
    sessionOtp, setSessionOtp,
    dispensingAmount, setDispensingAmount,
    activeScanBinding, setActiveScanBinding,
    selectedScanBinding, setSelectedScanBinding,
    activeAssignment, setActiveAssignment,
    pairingDigits, setPairingDigits,
    pairingAttempts, setPairingAttempts,
    pairingSuccess, setPairingSuccess,
    pairingError, setPairingError,
    showDeclineConfirm, setShowDeclineConfirm,
    showPairingHelp, setShowPairingHelp,
    showShiftSchedule, setShowShiftSchedule,
    selectedShiftBinding, setSelectedShiftBinding,
    showTripDetails, setShowTripDetails,
    selectedTripBinding, setSelectedTripBinding,
    declineBndId, setDeclineBndId,
    loginOtpRefs, onboardingOtpRefs, resetOtpRefs, sessionOtpRefs, pairingInputRefs,
    bindings, driver, pairedVehicles, mockTransactions,
    activeCards, currentCard, pendingAssignmentCount,
    activeBindings, pendingBindings, repairBindings, assignment,
    handlePinInput, handlePinBackspace,
    handleSessionPinInput, handleSessionPinBackspace,
    handleLoginOtpVerify, handleLogout,
    onClose: close,
  };

  return (
    <MGLSdkContext.Provider value={sdkValue}>
      <MGLAppContext.Provider value={appValue}>
        {children}
      </MGLAppContext.Provider>
    </MGLSdkContext.Provider>
  );
}
