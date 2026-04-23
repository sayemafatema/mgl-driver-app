import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { Svg, Rect, Line } from 'react-native-svg';
import {
  ChevronLeft, X, Lock, ChevronDown, MapPin, AlertCircle,
  User, ChevronRight, Clock, Check, QrCode, History, Phone,
  Home, Route, CheckCircle,
} from 'lucide-react-native';

// ── Mock Data ──────────────────────────────────────────────────────────────────

const INVITE_CODES_DB: { [key: string]: string } = {
  'ABC123': 'ABC Logistics Pvt. Ltd.',
  'XYZ789': 'XYZ Transport',
};

const PAIRING_CODES_DB: { [key: string]: { company: string; authorizer: string } } = {
  '123456': { company: 'ABC Logistics Pvt. Ltd.', authorizer: 'Ramesh Shah' },
  '789012': { company: 'XYZ Transport', authorizer: 'Priya Patel' },
};

const pairedVehiclesGlobal = [
  { vrn: 'MH 02 AB 1234', company: 'ABC Logistics Pvt. Ltd.', authMode: 'Vehicle-linked', balance: 14600, limit: 2000 },
  { vrn: 'MH 02 CD 5678', company: 'XYZ Transport', authMode: 'Day shift 06:00-14:00', balance: 8500, limit: 1500 },
];

const mockTransactionsGlobal = [
  { id: 'TXN001', station: 'MGL Hind CNG Filling', vrn: 'MH 02 AB 1234', amount: 672, date: 'Mar 23, 10:30 AM', type: 'Fueling', quantity: '4.2 kg', status: 'Success' },
  { id: 'TXN002', station: 'NEFT Credit', vrn: 'MH 02 AB 1234', amount: 10000, date: 'Mar 22, 02:15 PM', type: 'Credit', status: 'Success' },
  { id: 'TXN003', station: 'MGL Kurla Station', vrn: 'MH 02 CD 5678', amount: 1200, date: 'Mar 21, 08:45 AM', type: 'Fueling', quantity: '7.5 kg', status: 'Success' },
  { id: 'TXN004', station: 'MGL Andheri East', vrn: 'MH 02 AB 1234', amount: 950, date: 'Mar 20, 06:20 PM', type: 'Fueling', quantity: '6.0 kg', status: 'Success' },
];

const BINDINGS = [
  {
    id: 'BND001',
    vrn: 'MH 02 AB 1234',
    fo: 'ABC Logistics Pvt. Ltd.',
    authMode: 'vehicle_linked' as const,
    state: 'ACTIVE' as const,
    paired: true,
    scanPayStatus: 'always_available',
    balance: 14600,
    cardBalance: 12500,
    incentiveBalance: 2100,
    spendLimit: 2000,
    shiftDays: undefined as string[] | undefined,
    shiftStart: undefined as string | undefined,
    shiftEnd: undefined as string | undefined,
    shiftEndsIn: undefined as string | undefined,
    tripDate: undefined as string | undefined,
    tripStart: undefined as string | undefined,
    tripEnd: undefined as string | undefined,
    tripEndsIn: undefined as string | undefined,
    origin: undefined as string | undefined,
    destination: undefined as string | undefined,
    repairReason: undefined as string | undefined,
    assignedBy: undefined as string | undefined,
    validPairingCode: undefined as string | undefined,
  },
  {
    id: 'BND002',
    vrn: 'MH 02 CD 5678',
    fo: 'ABC Logistics Pvt. Ltd.',
    authMode: 'shift_based' as const,
    state: 'ACTIVE' as const,
    paired: true,
    scanPayStatus: 'in_window',
    shiftDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    shiftStart: '06:00',
    shiftEnd: '14:00',
    shiftEndsIn: '3h 20m',
    balance: 8200,
    cardBalance: 8200,
    incentiveBalance: 0,
    spendLimit: 1500,
    tripDate: undefined as string | undefined,
    tripStart: undefined as string | undefined,
    tripEnd: undefined as string | undefined,
    tripEndsIn: undefined as string | undefined,
    origin: undefined as string | undefined,
    destination: undefined as string | undefined,
    repairReason: undefined as string | undefined,
    assignedBy: undefined as string | undefined,
    validPairingCode: undefined as string | undefined,
  },
  {
    id: 'BND003',
    vrn: 'MH 04 GH 9012',
    fo: 'ABC Logistics Pvt. Ltd.',
    authMode: 'trip_linked' as const,
    state: 'ACTIVE' as const,
    paired: true,
    scanPayStatus: 'in_window',
    tripDate: 'Today',
    tripStart: '08:00',
    tripEnd: '18:00',
    tripEndsIn: '7h 20m',
    origin: 'Andheri East',
    destination: 'Pune',
    balance: 5400,
    cardBalance: 5400,
    incentiveBalance: 0,
    spendLimit: 3000,
    shiftDays: undefined as string[] | undefined,
    shiftStart: undefined as string | undefined,
    shiftEnd: undefined as string | undefined,
    shiftEndsIn: undefined as string | undefined,
    repairReason: undefined as string | undefined,
    assignedBy: undefined as string | undefined,
    validPairingCode: undefined as string | undefined,
  },
  {
    id: 'BND004',
    vrn: 'MH 06 EF 3456',
    fo: 'ABC Logistics Pvt. Ltd.',
    authMode: 'vehicle_linked' as const,
    state: 'PENDING_ACCEPTANCE' as const,
    paired: false,
    scanPayStatus: 'locked_unpaired',
    balance: 0,
    spendLimit: 2000,
    assignedBy: 'Ramesh Shah',
    validPairingCode: '234567',
    cardBalance: 0,
    incentiveBalance: 0,
    shiftDays: undefined as string[] | undefined,
    shiftStart: undefined as string | undefined,
    shiftEnd: undefined as string | undefined,
    shiftEndsIn: undefined as string | undefined,
    tripDate: undefined as string | undefined,
    tripStart: undefined as string | undefined,
    tripEnd: undefined as string | undefined,
    tripEndsIn: undefined as string | undefined,
    origin: undefined as string | undefined,
    destination: undefined as string | undefined,
    repairReason: undefined as string | undefined,
  },
  {
    id: 'BND005',
    vrn: 'MH 08 KL 7890',
    fo: 'XYZ Transport',
    authMode: 'shift_based' as const,
    state: 'ACTIVE' as const,
    paired: false,
    scanPayStatus: 'locked_repair',
    shiftDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shiftStart: '22:00',
    shiftEnd: '06:00',
    repairReason: 'Monthly re-verification',
    balance: 3200,
    spendLimit: 1000,
    validPairingCode: '345678',
    cardBalance: 3200,
    incentiveBalance: 0,
    shiftEndsIn: undefined as string | undefined,
    tripDate: undefined as string | undefined,
    tripStart: undefined as string | undefined,
    tripEnd: undefined as string | undefined,
    tripEndsIn: undefined as string | undefined,
    origin: undefined as string | undefined,
    destination: undefined as string | undefined,
    assignedBy: undefined as string | undefined,
  },
];

type Binding = typeof BINDINGS[0];
type DetailRow = { label: string; value: string; valueColor?: string };

const DRIVER = {
  id: 'DRV001',
  name: 'Ravi Sharma',
  initials: 'RS',
  mobile: '9876501234',
  maskedMobile: '+91 ••••••1234',
  pin: '123456',
  registered: true,
};

// ── Component ─────────────────────────────────────────────────────────────────

export function MGLApp({ onClose }: { onClose: () => void }) {
  const [isReturningUser] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<
    'login' | 'login_otp' | 'pin_login' | 'set_pin' | 'confirm_pin' | 'complete' |
    'forgot_pin' | 'forgot_otp' | 'invite_code' | '1c' | '1d' | '1e' | '1f' | 'registered'
  >('login');
  const [inviteCode, setInviteCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
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
  const [sessionState, setSessionState] = useState<'idle' | 'scanning' | 'confirmation' | 'otp_entry' | 'authorized' | 'complete'>('idle');
  const [sessionPin, setSessionPin] = useState('');
  const [sessionOtp, setSessionOtp] = useState('');
  const [dispensingAmount, setDispensingAmount] = useState(0);
  const [activeTab, setActiveTab] = useState<'card' | 'scan' | 'assignments' | 'transactions' | 'profile'>('card');
  const [txnFilter, setTxnFilter] = useState<'all' | 'successful' | 'failed'>('all');
  const [currentMainScreen, setCurrentMainScreen] = useState<'home_empty' | 'home_active' | 'assignment_notification' | 'pairing_code' | 'assignment_accepted'>('home_empty');
  const [activeCard, setActiveCard] = useState(0);
  const [expandPastAssignments, setExpandPastAssignments] = useState(false);
  const [showShiftSchedule, setShowShiftSchedule] = useState(false);
  const [selectedShiftBinding, setSelectedShiftBinding] = useState<Binding | null>(null);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [selectedTripBinding, setSelectedTripBinding] = useState<Binding | null>(null);
  const [declineBndId, setDeclineBndId] = useState<string | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Binding | null>(null);
  const [pairingDigits, setPairingDigits] = useState(Array(6).fill(''));
  const [pairingAttempts, setPairingAttempts] = useState(0);
  const [pairingSuccess, setPairingSuccess] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [showPairingHelp, setShowPairingHelp] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isRegistered] = useState(true);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [activeScanBinding, setActiveScanBinding] = useState<Binding | null>(null);
  const [selectedScanBinding, setSelectedScanBinding] = useState<Binding | null>(null);
  const [pairingError, setPairingError] = useState('');

  useEffect(() => {
    const firstAvailable = BINDINGS.find(
      b => b.scanPayStatus === 'always_available' || b.scanPayStatus === 'in_window'
    ) ?? null;
    setSelectedScanBinding(firstAvailable);
  }, []);

  const loginOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const onboardingOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const resetOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const sessionOtpRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const pairingInputRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);

  const pairedVehicles = pairedVehiclesGlobal;
  const mockTransactions = mockTransactionsGlobal;
  const activeCards = BINDINGS.filter(b => b.paired && b.state === 'ACTIVE');
  const currentCard = activeCards[activeCard];
  const pendingAssignmentCount = BINDINGS.filter(b =>
    b.state === 'PENDING_ACCEPTANCE' || (!b.paired && b.state === 'ACTIVE')
  ).length;
  const activeBindings = BINDINGS.filter(b => b.paired && b.state === 'ACTIVE');
  const pendingBindings = BINDINGS.filter(b => b.state === 'PENDING_ACCEPTANCE');
  const repairBindings = BINDINGS.filter(b => !b.paired && b.state === 'ACTIVE');

  const handlePinInput = (digit: string, isConfirm: boolean = false) => {
    if (isConfirm) {
      if (pinConfirm.length < 6) setPinConfirm(pinConfirm + digit);
    } else {
      if (pin.length < 6) setPin(pin + digit);
    }
  };

  const handlePinBackspace = (isConfirm: boolean = false) => {
    if (isConfirm) setPinConfirm(pinConfirm.slice(0, -1));
    else setPin(pin.slice(0, -1));
  };

  const handleSessionPinInput = (digit: string) => {
    if (sessionPin.length < 6) setSessionPin(sessionPin + digit);
  };

  const handleSessionPinBackspace = () => setSessionPin(sessionPin.slice(0, -1));

  const handleLoginOtpVerify = () => {
    const enteredOtp = otpDigits.join('');
    if (enteredOtp === '123456') {
      if (isRegistered) {
        if (isReturningUser) {
          setLoginPin('');
          setLoginPinError('');
          setWrongAttempts(0);
          setDisableNumpad(false);
          setOnboardingStep('pin_login');
        } else {
          setOnboardingStep('complete');
        }
      } else {
        setIsNewUser(true);
        setNewPin('');
        setPinConfirm('');
        setPinError('');
        setOnboardingStep('set_pin');
      }
    } else {
      setOtpError('Incorrect OTP. Try again.');
      setTimeout(() => {
        setOtpDigits(Array(6).fill(''));
        setOtpError('');
      }, 1500);
    }
  };

  const handleLogout = () => {
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
    onClose();
  };

  useEffect(() => {
    if (otpDigits.join('').length === 6 && onboardingStep === 'login_otp') {
      handleLoginOtpVerify();
    }
  }, [otpDigits, onboardingStep]);

  useEffect(() => {
    if (currentMainScreen === 'pairing_code') {
      setPairingDigits(['', '', '', '', '', '']);
      setTimeout(() => { pairingInputRefs.current[0]?.focus(); }, 100);
    }
  }, [currentMainScreen]);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // ── Sub-components ─────────────────────────────────────────────────────────

  const Numpad = ({ onPress, onBackspace }: { onPress: (d: string) => void; onBackspace: () => void; isConfirm?: boolean }) => (
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

  const PinDisplay = ({ value, error }: { value: string; error?: boolean }) => (
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

  // ── Onboarding Screens ─────────────────────────────────────────────────────

  if (onboardingStep !== 'complete') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16 }}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Login */}
          {onboardingStep === 'login' && (
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <Image source={require('../assets/mgl-logo.png')} style={{ width: 72, height: 72, resizeMode: 'contain' }} />
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 12 }}>MGL Fleet Connect</Text>
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Driver App</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ gap: 16 }}>
                <View>
                  <Text style={{ fontSize: 12, color: '#4b5563', fontWeight: '500', marginBottom: 8 }}>Mobile number</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <View style={{ paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, backgroundColor: '#f9fafb' }}>
                      <Text style={{ color: '#4b5563', fontWeight: '500', fontSize: 14 }}>+91</Text>
                    </View>
                    <TextInput
                      value={mobileNumber}
                      onChangeText={(t) => setMobileNumber(t.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter your mobile number"
                      keyboardType="numeric"
                      maxLength={10}
                      style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, fontSize: 14 }}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => { setOtpDigits(Array(6).fill('')); setOtpError(''); setOtpCountdown(30); setOnboardingStep('login_otp'); }}
                  disabled={mobileNumber.length !== 10}
                  activeOpacity={0.7}
                  style={{ backgroundColor: mobileNumber.length !== 10 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Send OTP</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#d1d5db' }} />
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>or</Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#d1d5db' }} />
                </View>
                <TouchableOpacity
                  onPress={() => { setInviteCode(''); setOnboardingStep('invite_code'); }}
                  activeOpacity={0.7}
                  style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
                >
                  <Text style={{ color: '#374151', fontWeight: '500' }}>New user? I have an invite code</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 16 }}>
                  By continuing you agree to MGL Fleet Terms of Service
                </Text>
              </View>
            </View>
          )}

          {/* Login OTP */}
          {onboardingStep === 'login_otp' && (
            <View>
              <TouchableOpacity onPress={() => setOnboardingStep('login')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <ChevronLeft size={20} color="#4b5563" />
                <Text style={{ color: '#4b5563' }}>Back</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Verify mobile</Text>
              <View style={{ backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 12, padding: 12, marginBottom: 24 }}>
                <Text style={{ fontSize: 14, color: '#1e3a5f' }}>OTP sent to +91 {mobileNumber.slice(-4).padStart(10, '•')}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => { loginOtpRefs.current[i] = r; }}
                    value={otpDigits[i] || ''}
                    onChangeText={(val) => {
                      const digit = val.replace(/\D/g, '').slice(-1);
                      const newDigits = [...otpDigits];
                      newDigits[i] = digit;
                      setOtpDigits(newDigits);
                      if (digit && i < 5) loginOtpRefs.current[i + 1]?.focus();
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    style={{ width: 42, height: 42, textAlign: 'center', fontSize: 18, fontWeight: '700', borderWidth: 2, borderRadius: 8, borderColor: otpDigits[i] ? '#15803d' : '#d1d5db' }}
                  />
                ))}
              </View>
              {otpError ? <Text style={{ color: '#ef4444', fontSize: 14, textAlign: 'center', marginBottom: 8 }}>{otpError}</Text> : null}
              <TouchableOpacity
                onPress={handleLoginOtpVerify}
                disabled={otpDigits.join('').length !== 6}
                activeOpacity={0.7}
                style={{ backgroundColor: otpDigits.join('').length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Verify</Text>
              </TouchableOpacity>
              {otpCountdown > 0 ? (
                <Text style={{ textAlign: 'center', fontSize: 12, color: '#6b7280' }}>Resend OTP in {otpCountdown}s</Text>
              ) : (
                <TouchableOpacity onPress={() => setOtpCountdown(30)} activeOpacity={0.7}>
                  <Text style={{ textAlign: 'center', color: '#15803d', fontWeight: '600', fontSize: 14, paddingVertical: 8 }}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* PIN Login */}
          {onboardingStep === 'pin_login' && (
            <View>
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <Image source={require('../assets/mgl-logo.png')} style={{ width: 48, height: 48, resizeMode: 'contain' }} />
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>Welcome back</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 4 }}>{DRIVER.name}</Text>
              </View>
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, color: '#4b5563', fontWeight: '500' }}>Enter your PIN</Text>
                <PinDisplay value={loginPin} error={showShake} />
                {loginPinError ? <Text style={{ fontSize: 12, color: '#dc2626', textAlign: 'center' }}>{loginPinError}</Text> : null}
              </View>
              <Numpad
                onPress={(digit) => {
                  if (!disableNumpad && loginPin.length < 6) {
                    const newP = loginPin + digit;
                    setLoginPin(newP);
                    setLoginPinError('');
                    if (newP.length === 6) {
                      if (newP === '123456') {
                        setShowShake(false);
                        setTimeout(() => setOnboardingStep('complete'), 300);
                      } else {
                        setShowShake(true);
                        const newAttempts = wrongAttempts + 1;
                        setWrongAttempts(newAttempts);
                        setLoginPinError('Incorrect PIN');
                        setTimeout(() => { setShowShake(false); setLoginPin(''); setLoginPinError(''); }, 500);
                        if (newAttempts >= 3) setDisableNumpad(true);
                      }
                    }
                  }
                }}
                onBackspace={() => setLoginPin(loginPin.slice(0, -1))}
              />
              {disableNumpad && (
                <View style={{ marginTop: 24, gap: 8 }}>
                  <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>Too many attempts. Try again later or reset your PIN.</Text>
                  <TouchableOpacity onPress={() => { setOnboardingStep('forgot_pin'); setLoginPin(''); setLoginPinError(''); }} activeOpacity={0.7}>
                    <Text style={{ color: '#15803d', fontWeight: '600', textAlign: 'center', paddingVertical: 8 }}>Forgot PIN?</Text>
                  </TouchableOpacity>
                </View>
              )}
              {!disableNumpad && (
                <TouchableOpacity onPress={() => { setOnboardingStep('forgot_pin'); setLoginPin(''); setLoginPinError(''); }} activeOpacity={0.7} style={{ marginTop: 24 }}>
                  <Text style={{ color: '#15803d', fontWeight: '600', textAlign: 'center', paddingVertical: 8 }}>Forgot PIN?</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Set PIN */}
          {onboardingStep === 'set_pin' && (
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>
                {isNewUser ? 'Create your PIN' : 'Set new PIN'}
              </Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>
                {isNewUser ? "You'll use this every time you sign in" : 'Choose a new 6-digit PIN'}
              </Text>
              <PinDisplay value={newPin} />
              <Numpad
                onPress={(digit) => { if (newPin.length < 6) setNewPin(newPin + digit); }}
                onBackspace={() => setNewPin(newPin.slice(0, -1))}
              />
              <TouchableOpacity
                onPress={() => { setPinConfirm(''); setPinError(''); setOnboardingStep('confirm_pin'); }}
                disabled={newPin.length !== 6}
                activeOpacity={0.7}
                style={{ backgroundColor: newPin.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 24 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Next</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Confirm PIN */}
          {onboardingStep === 'confirm_pin' && (
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Confirm your PIN</Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Enter the same PIN again</Text>
              {pinError ? <View style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fca5a5', borderRadius: 16, padding: 12, marginBottom: 16 }}><Text style={{ color: '#7f1d1d', fontSize: 14 }}>{pinError}</Text></View> : null}
              <PinDisplay value={pinConfirm} />
              <Numpad
                onPress={(digit) => { if (pinConfirm.length < 6) setPinConfirm(pinConfirm + digit); }}
                onBackspace={() => setPinConfirm(pinConfirm.slice(0, -1))}
                isConfirm
              />
              <TouchableOpacity
                onPress={() => {
                  if (newPin === pinConfirm) {
                    setPinError('');
                    if (isNewUser) {
                      setOnboardingStep('registered');
                    } else {
                      setSuccessToast('PIN updated successfully');
                      setTimeout(() => setSuccessToast(null), 2000);
                      setNewPin('');
                      setPinConfirm('');
                      setIsNewUser(false);
                      setOnboardingStep('pin_login');
                    }
                  } else {
                    setPinError("PINs didn't match. Try again.");
                    setPinConfirm('');
                    setOnboardingStep('set_pin');
                  }
                }}
                disabled={pinConfirm.length !== 6}
                activeOpacity={0.7}
                style={{ backgroundColor: pinConfirm.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 24 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Confirm PIN</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Registered */}
          {onboardingStep === 'registered' && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <CheckCircle size={80} color="#16a34a" />
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#15803d', textAlign: 'center' }}>PIN created successfully</Text>
              <Text style={{ textAlign: 'center', color: '#4b5563' }}>You can now use Scan & Pay at any MGL CNG station</Text>
              <TouchableOpacity
                onPress={() => { setNewPin(''); setPinConfirm(''); setIsNewUser(false); setOnboardingStep('complete'); }}
                activeOpacity={0.7}
                style={{ backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', width: '100%', marginTop: 16 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Continue to Home</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Invite Code */}
          {onboardingStep === 'invite_code' && (
            <View>
              <TouchableOpacity onPress={() => setOnboardingStep('login')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ChevronLeft size={20} color="#4b5563" />
                <Text style={{ color: '#4b5563' }}>Back</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Invite Code</Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Enter the 6-character code your Fleet Operator shared</Text>
              <TextInput
                value={inviteCode}
                onChangeText={(t) => setInviteCode(t.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                maxLength={6}
                placeholder="ABC123"
                autoCapitalize="characters"
                style={{ paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 16, textAlign: 'center', fontSize: 20, letterSpacing: 6, fontWeight: '700', marginBottom: 16 }}
              />
              {inviteCode.length === 6 && INVITE_CODES_DB[inviteCode] && (
                <View style={{ backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#86efac', borderRadius: 16, padding: 12, marginBottom: 16, flexDirection: 'row', gap: 12 }}>
                  <Check size={20} color="#15803d" />
                  <Text style={{ fontWeight: '600', color: '#14532d', fontSize: 14 }}>{INVITE_CODES_DB[inviteCode]}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => setOnboardingStep('1c')}
                disabled={inviteCode.length !== 6 || !INVITE_CODES_DB[inviteCode]}
                activeOpacity={0.7}
                style={{ backgroundColor: (inviteCode.length !== 6 || !INVITE_CODES_DB[inviteCode]) ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 1c: Mobile Verify */}
          {onboardingStep === '1c' && (
            <View>
              <TouchableOpacity onPress={() => setOnboardingStep('invite_code')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ChevronLeft size={20} color="#4b5563" />
                <Text style={{ color: '#4b5563' }}>Back</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Mobile Verification</Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Must match number your Fleet Operator provided</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#4b5563', paddingTop: 14 }}>+91</Text>
                <TextInput
                  value={mobileNumber}
                  onChangeText={(t) => setMobileNumber(t.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  keyboardType="numeric"
                  style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 16 }}
                />
              </View>
              <TouchableOpacity
                onPress={() => { setOtpCountdown(30); setOnboardingStep('1d'); }}
                disabled={mobileNumber.length !== 10}
                activeOpacity={0.7}
                style={{ backgroundColor: mobileNumber.length !== 10 ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 1d: OTP Entry */}
          {onboardingStep === '1d' && (
            <View>
              <TouchableOpacity onPress={() => setOnboardingStep('1c')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ChevronLeft size={20} color="#4b5563" />
                <Text style={{ color: '#4b5563' }}>Back</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Verify OTP</Text>
              <View style={{ backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 16, padding: 12, marginBottom: 16 }}>
                <Text style={{ fontSize: 14, color: '#1e3a5f' }}>OTP sent to +91 {mobileNumber.slice(-4).padStart(10, '•')}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => { onboardingOtpRefs.current[i] = r; }}
                    value={otp[i] || ''}
                    onChangeText={(val) => {
                      const digit = val.replace(/\D/g, '').slice(-1);
                      const newOtpArr = otp.split('');
                      newOtpArr[i] = digit;
                      setOtp(newOtpArr.join('').slice(0, 6));
                      if (digit && i < 5) onboardingOtpRefs.current[i + 1]?.focus();
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    style={{ width: 42, height: 42, textAlign: 'center', fontSize: 18, fontWeight: '700', borderWidth: 2, borderRadius: 8, borderColor: otp[i] ? '#15803d' : '#d1d5db' }}
                  />
                ))}
              </View>
              <TouchableOpacity
                onPress={() => setOnboardingStep('1e')}
                disabled={otp.length !== 6}
                activeOpacity={0.7}
                style={{ backgroundColor: otp.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 8 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={{ color: '#15803d', fontWeight: '600', textAlign: 'center', paddingVertical: 8 }}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 1e: PIN Setup */}
          {onboardingStep === '1e' && (
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Create your app PIN</Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>6 digits for fueling authorization</Text>
              <PinDisplay value={pin} />
              <Numpad onPress={(digit) => handlePinInput(digit, false)} onBackspace={() => handlePinBackspace(false)} />
              <TouchableOpacity
                onPress={() => setOnboardingStep('1f')}
                disabled={pin.length !== 6}
                activeOpacity={0.7}
                style={{ backgroundColor: pin.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 24 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Next</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 1f: PIN Confirm */}
          {onboardingStep === '1f' && (
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Confirm your PIN</Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Enter the same PIN again</Text>
              {pinError ? <View style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fca5a5', borderRadius: 16, padding: 12, marginBottom: 16 }}><Text style={{ color: '#7f1d1d', fontSize: 14 }}>{pinError}</Text></View> : null}
              <PinDisplay value={pinConfirm} />
              <Numpad onPress={(digit) => handlePinInput(digit, true)} onBackspace={() => handlePinBackspace(true)} isConfirm />
              <TouchableOpacity
                onPress={() => {
                  if (pin === pinConfirm) { setPinError(''); setOnboardingStep('complete'); }
                  else { setPinError("PINs don't match, try again"); setPinConfirm(''); }
                }}
                disabled={pinConfirm.length !== 6}
                activeOpacity={0.7}
                style={{ backgroundColor: pinConfirm.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 24 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Confirm PIN</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Forgot PIN */}
          {onboardingStep === 'forgot_pin' && (
            <View>
              <TouchableOpacity onPress={() => setOnboardingStep('pin_login')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ChevronLeft size={20} color="#4b5563" />
                <Text style={{ color: '#4b5563' }}>Back</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Reset your PIN</Text>
              <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24 }}>Verify your mobile to reset</Text>
              <View style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 16, marginBottom: 24, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Phone size={20} color="#4b5563" />
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>+91 ••••••1234</Text>
                  <Text style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>Your registered mobile number</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => { setOtp(''); setOtpCountdown(30); setOnboardingStep('forgot_otp'); }}
                activeOpacity={0.7}
                style={{ backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Forgot OTP */}
          {onboardingStep === 'forgot_otp' && (
            <View>
              <TouchableOpacity onPress={() => setOnboardingStep('forgot_pin')} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ChevronLeft size={20} color="#4b5563" />
                <Text style={{ color: '#4b5563' }}>Back</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Verify mobile</Text>
              <View style={{ backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 16, padding: 12, marginBottom: 16 }}>
                <Text style={{ fontSize: 14, color: '#1e3a5f' }}>OTP sent to +91 ••••••1234</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => { resetOtpRefs.current[i] = r; }}
                    value={otp[i] || ''}
                    onChangeText={(val) => {
                      const digit = val.replace(/\D/g, '').slice(-1);
                      const arr = otp.split('');
                      arr[i] = digit;
                      setOtp(arr.join('').slice(0, 6));
                      if (digit && i < 5) resetOtpRefs.current[i + 1]?.focus();
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    style={{ width: 42, height: 42, textAlign: 'center', fontSize: 18, fontWeight: '700', borderWidth: 2, borderRadius: 8, borderColor: otp[i] ? '#15803d' : '#d1d5db' }}
                  />
                ))}
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (otp === '123456') { setOtp(''); setNewPin(''); setPinConfirm(''); setPinError(''); setIsNewUser(false); setOnboardingStep('set_pin'); }
                }}
                disabled={otp.length !== 6}
                activeOpacity={0.7}
                style={{ backgroundColor: otp.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 12 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Verify</Text>
              </TouchableOpacity>
              {otpCountdown > 0 ? (
                <Text style={{ textAlign: 'center', fontSize: 12, color: '#6b7280' }}>Resend OTP in {otpCountdown}s</Text>
              ) : (
                <TouchableOpacity onPress={() => setOtpCountdown(30)} activeOpacity={0.7}>
                  <Text style={{ color: '#15803d', fontWeight: '600', textAlign: 'center', paddingVertical: 8 }}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Main App ───────────────────────────────────────────────────────────────

  const assignment = activeAssignment || BINDINGS[3];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>

        {/* Assignment Notification Screen */}
        {currentMainScreen === 'assignment_notification' && (
          <View style={{ flex: 1 }}>
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
              <TouchableOpacity onPress={() => setCurrentMainScreen('home_empty')} activeOpacity={0.7}>
                <ChevronLeft size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 16 }}>
              <View style={{ backgroundColor: '#fef3c7', borderRadius: 16, padding: 16, alignItems: 'center', gap: 8 }}>
                <Lock size={32} color="#d97706" />
                <Text style={{ fontWeight: '700', fontSize: 18, color: '#92400e', textAlign: 'center' }}>New Assignment</Text>
                <Text style={{ fontSize: 13, color: '#78350f', textAlign: 'center' }}>From {assignment.fo}</Text>
              </View>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 28, fontFamily: 'monospace', fontWeight: '700', color: '#111827' }}>{assignment.vrn}</Text>
                <Text style={{ fontSize: 14, color: '#4b5563' }}>{assignment.fo}</Text>
                {assignment.assignedBy && <Text style={{ fontSize: 12, color: '#4b5563' }}>Assigned by {assignment.assignedBy}</Text>}
              </View>
              {assignment.authMode === 'vehicle_linked' && (
                <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={20} color="#16a34a" />
                    <Text style={{ fontWeight: '600', color: '#111827' }}>Permanent assignment</Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#4b5563' }}>Scan & Pay will be available at all times once paired</Text>
                </View>
              )}
              {assignment.authMode === 'shift_based' && (
                <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, gap: 8 }}>
                  <Text style={{ fontWeight: '600', color: '#111827' }}>Shift schedule</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#4b5563' }}>Day</Text>
                    <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#4b5563' }}>Start</Text>
                    <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#4b5563' }}>End</Text>
                  </View>
                  {assignment.shiftDays?.map((day) => (
                    <View key={day} style={{ flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 8 }}>
                      <Text style={{ flex: 1, fontSize: 14, color: '#111827' }}>{day}</Text>
                      <Text style={{ flex: 1, fontSize: 14, color: '#111827', fontFamily: 'monospace' }}>{assignment.shiftStart}</Text>
                      <Text style={{ flex: 1, fontSize: 14, color: '#111827', fontFamily: 'monospace' }}>{assignment.shiftEnd}</Text>
                    </View>
                  ))}
                  <Text style={{ fontSize: 12, color: '#b45309', paddingTop: 8 }}>Scan & Pay available within shift windows only</Text>
                </View>
              )}
              {assignment.authMode === 'trip_linked' && (
                <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, gap: 8 }}>
                  {[
                    { label: 'Date', value: assignment.tripDate },
                    { label: 'Window', value: `${assignment.tripStart} – ${assignment.tripEnd}` },
                    { label: 'From', value: assignment.origin },
                    { label: 'To', value: assignment.destination },
                  ].map((row, i, arr) => (
                    <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: '#f3f4f6' }}>
                      <Text style={{ fontSize: 14, color: '#4b5563' }}>{row.label}</Text>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{row.value}</Text>
                    </View>
                  ))}
                  <Text style={{ fontSize: 12, color: '#1d4ed8', paddingTop: 8 }}>Scan & Pay available within trip window only</Text>
                </View>
              )}
              <View style={{ backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', borderRadius: 12, padding: 16, gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Lock size={20} color="#b45309" />
                  <Text style={{ fontWeight: '700', color: '#78350f' }}>Pairing required</Text>
                </View>
                <Text style={{ fontSize: 14, color: '#92400e' }}>Enter the 6-digit code from your Fleet Operator to activate fueling</Text>
              </View>
            </ScrollView>
            <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', backgroundColor: '#fff', padding: 24, gap: 12 }}>
              <TouchableOpacity
                onPress={() => { setPairingDigits(Array(6).fill('')); setPairingError(''); setPairingAttempts(0); setPairingSuccess(false); setCurrentMainScreen('pairing_code'); }}
                activeOpacity={0.7}
                style={{ backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Accept & Pair</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDeclineConfirm(true)}
                activeOpacity={0.7}
                style={{ borderWidth: 1, borderColor: '#fca5a5', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#dc2626', fontWeight: '600' }}>Decline</Text>
              </TouchableOpacity>
            </View>
            <Modal visible={showDeclineConfirm} transparent animationType="fade" onRequestClose={() => setShowDeclineConfirm(false)}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, gap: 16, width: '100%', maxWidth: 360 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Decline this assignment?</Text>
                  <Text style={{ fontSize: 14, color: '#4b5563' }}>Your Fleet Operator will be notified.</Text>
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                    <TouchableOpacity onPress={() => setShowDeclineConfirm(false)} activeOpacity={0.7} style={{ flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}>
                      <Text style={{ color: '#374151', fontWeight: '600' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setShowDeclineConfirm(false); setCurrentMainScreen('home_empty'); }} activeOpacity={0.7} style={{ flex: 1, backgroundColor: '#dc2626', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}>Yes, decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}

        {/* Pairing Code Screen */}
        {currentMainScreen === 'pairing_code' && (
          <View style={{ flex: 1 }}>
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
              <TouchableOpacity onPress={() => setCurrentMainScreen('assignment_notification')} activeOpacity={0.7}>
                <ChevronLeft size={24} color="#4b5563" />
              </TouchableOpacity>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827' }}>Enter pairing code</Text>
              <View style={{ width: 24 }} />
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 24 }} keyboardShouldPersistTaps="handled">
              <View style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, gap: 12 }}>
                <Text style={{ fontSize: 22, fontFamily: 'monospace', fontWeight: '700', color: '#111827' }}>{assignment.vrn}</Text>
                <View>
                  {assignment.authMode === 'vehicle_linked' && <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start' }}><Text style={{ color: '#15803d', fontSize: 12, fontWeight: '700' }}>Vehicle-linked</Text></View>}
                  {assignment.authMode === 'shift_based' && <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start' }}><Text style={{ color: '#b45309', fontSize: 12, fontWeight: '700' }}>Shift-based</Text></View>}
                  {assignment.authMode === 'trip_linked' && <View style={{ backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start' }}><Text style={{ color: '#1d4ed8', fontSize: 12, fontWeight: '700' }}>Trip-linked</Text></View>}
                </View>
                <Text style={{ fontSize: 14, color: '#4b5563' }}>
                  {assignment.authMode === 'vehicle_linked' && 'Permanent assignment'}
                  {assignment.authMode === 'shift_based' && `Mon–Fri · ${assignment.shiftStart}–${assignment.shiftEnd}`}
                  {assignment.authMode === 'trip_linked' && `Today · ${assignment.tripStart}–${assignment.tripEnd} · ${assignment.origin} → ${assignment.destination}`}
                </Text>
                <Text style={{ fontSize: 12, color: '#4b5563' }}>{assignment.fo}</Text>
              </View>
              <Text style={{ fontSize: 14, color: '#4b5563', textAlign: 'center' }}>Enter the 6-digit code your Fleet Operator shared with you</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
                {pairingDigits.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => { pairingInputRefs.current[i] = r; }}
                    value={digit}
                    onChangeText={(val) => {
                      const v = val.replace(/[^0-9]/g, '');
                      if (!v) return;
                      const next = [...pairingDigits];
                      next[i] = v.slice(-1);
                      setPairingDigits(next);
                      if (i < 5) pairingInputRefs.current[i + 1]?.focus();
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace') {
                        const next = [...pairingDigits];
                        if (next[i]) { next[i] = ''; setPairingDigits(next); }
                        else if (i > 0) { pairingInputRefs.current[i - 1]?.focus(); }
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    style={{ width: 44, height: 56, textAlign: 'center', fontSize: 20, fontFamily: 'monospace', fontWeight: '700', borderWidth: 2, borderRadius: 12, borderColor: digit ? '#22c55e' : '#d1d5db', backgroundColor: digit ? '#f0fdf4' : '#fff' }}
                  />
                ))}
              </View>
              {pairingSuccess && (
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={32} color="#16a34a" />
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#15803d' }}>Pairing successful!</Text>
                  <Text style={{ fontSize: 14, color: '#4b5563' }}>Activating your assignment...</Text>
                </View>
              )}
              {pairingError && !pairingSuccess && (
                <Text style={{ textAlign: 'center', fontSize: 14, color: '#dc2626' }}>{pairingError}</Text>
              )}
              {pairingAttempts >= 3 && (
                <View style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 12, padding: 16, gap: 8 }}>
                  <Text style={{ fontWeight: '700', color: '#7f1d1d' }}>Too many attempts</Text>
                  <Text style={{ fontSize: 14, color: '#991b1b' }}>Contact your Fleet Operator for a new code.</Text>
                </View>
              )}
              {pairingAttempts < 3 && !pairingSuccess && (
                <TouchableOpacity
                  onPress={() => {
                    const code = pairingDigits.join('');
                    const validCode = activeAssignment?.validPairingCode || BINDINGS[3].validPairingCode;
                    if (code === validCode) {
                      setPairingSuccess(true);
                      setTimeout(() => setCurrentMainScreen('assignment_accepted'), 1500);
                    } else {
                      const attempts = pairingAttempts + 1;
                      setPairingAttempts(attempts);
                      setPairingError('Incorrect code');
                      setTimeout(() => { setPairingDigits(Array(6).fill('')); setPairingError(''); pairingInputRefs.current[0]?.focus(); }, 1500);
                    }
                  }}
                  disabled={pairingDigits.some(d => d === '')}
                  activeOpacity={0.7}
                  style={{ backgroundColor: pairingDigits.some(d => d === '') ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Verify & Activate</Text>
                </TouchableOpacity>
              )}
              {pairingAttempts >= 3 && (
                <TouchableOpacity onPress={() => setCurrentMainScreen('home_empty')} activeOpacity={0.7} style={{ backgroundColor: '#d1d5db', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}>
                  <Text style={{ color: '#374151', fontWeight: '600' }}>Close</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowPairingHelp(true)} activeOpacity={0.7}>
                <Text style={{ textAlign: 'center', fontSize: 14, color: '#15803d', fontWeight: '600' }}>Haven't received your code?</Text>
              </TouchableOpacity>
            </ScrollView>
            <Modal visible={showPairingHelp} transparent animationType="slide" onRequestClose={() => setShowPairingHelp(false)}>
              <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => setShowPairingHelp(false)}>
                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, gap: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Pairing code help</Text>
                    <TouchableOpacity onPress={() => setShowPairingHelp(false)} activeOpacity={0.7}>
                      <X size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ fontSize: 14, color: '#374151' }}>Ask your Fleet Operator to share the 6-digit pairing code for this assignment.</Text>
                  <Text style={{ fontSize: 14, color: '#374151' }}>They can find it in the MGL Fleet portal under Driver Management.</Text>
                </View>
              </Pressable>
            </Modal>
          </View>
        )}

        {/* Assignment Accepted Screen */}
        {currentMainScreen === 'assignment_accepted' && (
          <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24, backgroundColor: '#f0fdf4' }}>
            <CheckCircle size={80} color="#16a34a" />
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#15803d', textAlign: 'center' }}>Assignment activated!</Text>
            <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99 }}>
              <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: '#15803d', fontSize: 16 }}>{assignment.vrn}</Text>
            </View>
            <View style={{ width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, gap: 12, marginTop: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>What's now unlocked</Text>
              {assignment.authMode === 'vehicle_linked' && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <CheckCircle size={20} color="#16a34a" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: '#111827' }}>Scan & Pay always available</Text>
                    <Text style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>You can fuel {assignment.vrn} at any MGL CNG station at any time</Text>
                  </View>
                </View>
              )}
              {assignment.authMode === 'shift_based' && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Clock size={20} color="#d97706" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: '#111827' }}>Scan & Pay within shift hours</Text>
                    <Text style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>Mon–Fri · {assignment.shiftStart}–{assignment.shiftEnd}</Text>
                  </View>
                </View>
              )}
              {assignment.authMode === 'trip_linked' && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <MapPin size={20} color="#2563eb" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: '#111827' }}>Scan & Pay until {assignment.tripEnd} today</Text>
                    <Text style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>{assignment.origin} → {assignment.destination}</Text>
                  </View>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => { setActiveAssignment(null); setCurrentMainScreen('home_empty'); setActiveTab('assignments'); }}
              activeOpacity={0.7}
              style={{ width: '100%', backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 16 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Go to My Assignments</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Main Screens */}
        {currentMainScreen !== 'assignment_notification' && currentMainScreen !== 'pairing_code' && currentMainScreen !== 'assignment_accepted' && (
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ backgroundColor: '#16a34a', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: '#bbf7d0', fontSize: 14 }}>Good morning</Text>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20, marginTop: 2 }}>{DRIVER.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{DRIVER.initials}</Text>
                  </View>
                  <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Session Banner */}
            {sessionState !== 'idle' && (
              <View style={{ backgroundColor: '#dbeafe', borderBottomWidth: 1, borderBottomColor: '#93c5fd', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' }} />
                <Text style={{ color: '#1e40af', fontWeight: '600', fontSize: 12 }}>Fueling in progress · MH 02 AB 1234</Text>
              </View>
            )}

            {/* Success Toast */}
            {successToast && (
              <View style={{ backgroundColor: '#16a34a', paddingHorizontal: 24, paddingVertical: 12 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{successToast}</Text>
              </View>
            )}

            {/* Tab Content */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }} keyboardShouldPersistTaps="handled">

              {/* Card Tab */}
              {activeTab === 'card' && currentCard && (
                <View style={{ padding: 16, gap: 16 }}>
                  {pendingAssignmentCount > 0 && (
                    <View style={{ backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <AlertCircle size={20} color="#d97706" />
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#78350f' }}>{pendingAssignmentCount} assignment{pendingAssignmentCount > 1 ? 's' : ''} need your attention</Text>
                      </View>
                      <TouchableOpacity onPress={() => setActiveTab('assignments')} activeOpacity={0.7}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#15803d' }}>View</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Vehicle Card */}
                  <View>
                    <View style={{ backgroundColor: '#15803d', borderRadius: 16, overflow: 'hidden', minHeight: 160 }}>
                      <View style={{ padding: 20, flex: 1, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>{currentCard.fo}</Text>
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>MGL</Text>
                          </View>
                        </View>
                        <Text style={{ color: '#fff', fontFamily: 'monospace', fontWeight: '700', fontSize: 20, letterSpacing: 3, marginVertical: 12 }}>{activeCards[activeCard]?.vrn}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                              {currentCard.authMode === 'vehicle_linked' && 'Vehicle-linked'}
                              {currentCard.authMode === 'shift_based' && `Shift · ends ${currentCard.shiftEnd}`}
                              {currentCard.authMode === 'trip_linked' && `Trip · ends ${currentCard.tripEnd}`}
                            </Text>
                          </View>
                          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                            {currentCard.authMode === 'shift_based' && currentCard.shiftEndsIn}
                            {currentCard.authMode === 'trip_linked' && `${currentCard.origin} → ${currentCard.destination}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {activeCards.length > 1 && (
                      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 }}>
                        {activeCards.map((_, i) => (
                          <TouchableOpacity key={i} onPress={() => setActiveCard(i)} activeOpacity={0.7}>
                            <View style={{ width: i === activeCard ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === activeCard ? '#16a34a' : '#d1d5db' }} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    {activeCards.length > 1 && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        {activeCard > 0 ? (
                          <TouchableOpacity onPress={() => setActiveCard(activeCard - 1)} activeOpacity={0.7} style={{ padding: 8 }}>
                            <ChevronLeft size={20} color="#111827" />
                          </TouchableOpacity>
                        ) : <View style={{ width: 36 }} />}
                        {activeCard < activeCards.length - 1 ? (
                          <TouchableOpacity onPress={() => setActiveCard(activeCard + 1)} activeOpacity={0.7} style={{ padding: 8 }}>
                            <ChevronRight size={20} color="#111827" />
                          </TouchableOpacity>
                        ) : <View style={{ width: 36 }} />}
                      </View>
                    )}
                  </View>

                  {/* Balance */}
                  <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                    <Text style={{ fontSize: 11, color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }}>Vehicle Balance</Text>
                    <Text style={{ fontSize: 36, fontWeight: '700', textAlign: 'center', marginTop: 4 }}>₹{activeCards[activeCard]?.balance?.toLocaleString('en-IN')}</Text>
                    {(activeCards[activeCard]?.incentiveBalance ?? 0) > 0 && (
                      <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 4 }}>
                        Card ₹{activeCards[activeCard]?.cardBalance?.toLocaleString('en-IN')} · Incentive ₹{activeCards[activeCard]?.incentiveBalance?.toLocaleString('en-IN')}
                      </Text>
                    )}
                    <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 2 }}>
                      Spend limit ₹{activeCards[activeCard]?.spendLimit?.toLocaleString('en-IN')} per fueling
                    </Text>
                  </View>

                  {/* Quick Actions */}
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity onPress={() => { setSessionState('scanning'); setActiveTab('scan'); }} activeOpacity={0.7} style={{ flex: 1, backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, alignItems: 'center', gap: 8 }}>
                      <QrCode size={24} color="#15803d" />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#15803d' }}>Scan & Pay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('transactions')} activeOpacity={0.7} style={{ flex: 1, backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, alignItems: 'center', gap: 8 }}>
                      <History size={24} color="#6b7280" />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#6b7280' }}>History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { setActiveAssignment(BINDINGS[3]); setCurrentMainScreen('assignment_notification'); }}
                      activeOpacity={0.7}
                      style={{ flex: 1, backgroundColor: '#fffbeb', borderRadius: 12, padding: 16, alignItems: 'center', gap: 8 }}
                    >
                      <AlertCircle size={24} color="#d97706" />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#d97706' }}>Assign</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Recent Transactions */}
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Text style={{ fontWeight: '700', color: '#111827' }}>Recent transactions</Text>
                      <TouchableOpacity onPress={() => setActiveTab('transactions')} activeOpacity={0.7}>
                        <Text style={{ fontSize: 14, color: '#15803d', fontWeight: '600' }}>See all</Text>
                      </TouchableOpacity>
                    </View>
                    {mockTransactions.slice(0, 3).map((txn) => (
                      <View key={txn.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{txn.station}</Text>
                          <Text style={{ fontSize: 12, color: '#4b5563' }}>{txn.date}</Text>
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: txn.type === 'Fueling' ? '#dc2626' : '#16a34a' }}>
                          {txn.type === 'Fueling' ? '-' : '+'}₹{txn.amount}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Scan Tab */}
              {activeTab === 'scan' && (
                <View style={{ padding: 16, gap: 16 }}>
                  {/* Vehicle selector */}
                  {(() => {
                    const scanBindings = BINDINGS.filter(b => b.scanPayStatus === 'always_available' || b.scanPayStatus === 'in_window');
                    if (scanBindings.length === 0) {
                      return (
                        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                          <QrCode size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
                          <Text style={{ fontWeight: '600', color: '#4b5563', marginBottom: 4 }}>No vehicles available for scan</Text>
                          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>Accept an assignment and complete pairing to enable Scan & Pay</Text>
                        </View>
                      );
                    }
                    return (
                      <View style={{ gap: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Scan & Pay</Text>
                        <View style={{ gap: 8 }}>
                          {scanBindings.map((b) => (
                            <TouchableOpacity
                              key={b.id}
                              onPress={() => setSelectedScanBinding(b)}
                              activeOpacity={0.7}
                              style={{ borderWidth: 2, borderColor: selectedScanBinding?.id === b.id ? '#15803d' : '#e5e7eb', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: selectedScanBinding?.id === b.id ? '#f0fdf4' : '#fff' }}
                            >
                              <View>
                                <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: '#111827' }}>{b.vrn}</Text>
                                <Text style={{ fontSize: 12, color: '#4b5563' }}>{b.fo}</Text>
                              </View>
                              <View style={{ backgroundColor: b.scanPayStatus === 'always_available' ? '#dcfce7' : '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: b.scanPayStatus === 'always_available' ? '#15803d' : '#b45309' }}>
                                  {b.scanPayStatus === 'always_available' ? 'Always' : 'In window'}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>

                        {selectedScanBinding && (
                          <View style={{ backgroundColor: '#f9fafb', borderRadius: 16, padding: 12, gap: 8 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>Fueling: {selectedScanBinding.vrn}</Text>
                            <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start' }}>
                              <Text style={{ fontSize: 12, fontWeight: '600', color: '#15803d' }}>
                                {selectedScanBinding.scanPayStatus === 'always_available' ? 'Always available' : `Active · ends ${selectedScanBinding.shiftEnd || 'today'}`}
                              </Text>
                            </View>
                          </View>
                        )}

                        {/* Camera viewfinder */}
                        <View style={{ backgroundColor: '#000', borderRadius: 16, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff', overflow: 'hidden' }}>
                          <View style={{ position: 'absolute', top: 16, left: 16, right: 16, bottom: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 8 }} />
                          <QrCode size={48} color="rgba(255,255,255,0.5)" />
                        </View>

                        <TouchableOpacity
                          onPress={() => { setActiveScanBinding(selectedScanBinding); setSessionState('confirmation'); }}
                          activeOpacity={0.7}
                          style={{ backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
                        >
                          <Text style={{ color: '#fff', fontWeight: '600' }}>Simulate Scan</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })()}

                  {/* Scan Session: Confirmation */}
                  {sessionState === 'confirmation' && activeScanBinding && (
                    <View style={{ gap: 16, marginTop: 8 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Confirm fueling</Text>
                        <TouchableOpacity onPress={() => { setSessionState('idle'); setActiveScanBinding(null); }} activeOpacity={0.7}>
                          <X size={20} color="#4b5563" />
                        </TouchableOpacity>
                      </View>
                      <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 16, flexDirection: 'row', gap: 12 }}>
                        <MapPin size={20} color="#15803d" />
                        <View>
                          <Text style={{ fontWeight: '600', color: '#111827' }}>MGL Hind CNG Filling Station</Text>
                          <Text style={{ fontSize: 14, color: '#4b5563' }}>Andheri, Mumbai</Text>
                        </View>
                      </View>
                      <View style={{ backgroundColor: '#f9fafb', borderRadius: 16, padding: 16, gap: 8 }}>
                        {(([
                          { label: 'Vehicle', value: activeScanBinding.vrn },
                          { label: 'Fleet Operator', value: activeScanBinding.fo },
                          { label: 'Available balance', value: `₹${activeScanBinding.balance?.toLocaleString('en-IN') || '0'}`, valueColor: '#15803d' },
                          { label: 'Spend limit', value: `₹${activeScanBinding.spendLimit?.toLocaleString('en-IN') || '5,000'}` },
                        ]) as DetailRow[]).map((row, i) => (
                          <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: i > 0 ? 8 : 0, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: '#e5e7eb' }}>
                            <Text style={{ fontSize: 14, color: '#4b5563' }}>{row.label}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: row.valueColor ?? '#111827' }}>{row.value}</Text>
                          </View>
                        ))}
                      </View>
                      <View>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 }}>Enter your PIN to confirm</Text>
                        <PinDisplay value={sessionPin} />
                        <Numpad onPress={handleSessionPinInput} onBackspace={handleSessionPinBackspace} />
                      </View>
                      <TouchableOpacity
                        onPress={() => { if (sessionPin === '123456') setSessionState('otp_entry'); else setSessionPin(''); }}
                        disabled={sessionPin.length !== 6}
                        activeOpacity={0.7}
                        style={{ backgroundColor: sessionPin.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Verify PIN</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Scan Session: OTP Entry */}
                  {sessionState === 'otp_entry' && activeScanBinding && (
                    <View style={{ gap: 16, marginTop: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity onPress={() => setSessionState('confirmation')} activeOpacity={0.7}>
                          <ChevronLeft size={20} color="#4b5563" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>One-time password</Text>
                      </View>
                      <View style={{ backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 16, padding: 12 }}>
                        <Text style={{ fontSize: 14, color: '#1e3a5f' }}>OTP sent to +91 {mobileNumber.slice(-4).padStart(10, '•') || '••••••1234'}</Text>
                      </View>
                      <View style={{ backgroundColor: '#f3f4f6', borderRadius: 16, padding: 12 }}>
                        <Text style={{ fontSize: 12, color: '#4b5563' }}>{activeScanBinding.vrn} · MGL Hind Station · ₹1,200</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <TextInput
                            key={i}
                            ref={(r) => { sessionOtpRefs.current[i] = r; }}
                            value={sessionOtp[i] || ''}
                            onChangeText={(val) => {
                              const digit = val.replace(/\D/g, '').slice(-1);
                              const arr = sessionOtp.split('');
                              arr[i] = digit;
                              setSessionOtp(arr.join('').slice(0, 6));
                              if (digit && i < 5) sessionOtpRefs.current[i + 1]?.focus();
                            }}
                            keyboardType="numeric"
                            maxLength={1}
                            style={{ width: 42, height: 42, textAlign: 'center', fontSize: 18, fontWeight: '700', borderWidth: 2, borderRadius: 8, borderColor: sessionOtp[i] ? '#15803d' : '#d1d5db' }}
                          />
                        ))}
                      </View>
                      <Text style={{ textAlign: 'center', fontSize: 12, color: '#dc2626' }}>Session expires in 1:24</Text>
                      <TouchableOpacity
                        onPress={() => { if (sessionOtp.length === 6) setSessionState('authorized'); }}
                        disabled={sessionOtp.length !== 6}
                        activeOpacity={0.7}
                        style={{ backgroundColor: sessionOtp.length !== 6 ? '#d1d5db' : '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Verify & Authorize</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.7}>
                        <Text style={{ color: '#15803d', fontWeight: '600', textAlign: 'center', paddingVertical: 8 }}>Resend OTP</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Scan Session: Authorized */}
                  {sessionState === 'authorized' && (
                    <View style={{ gap: 16, marginTop: 8 }}>
                      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
                        <View style={{ width: 64, height: 64, backgroundColor: '#dcfce7', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                          <Check size={32} color="#15803d" />
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 }}>Fueling authorized</Text>
                        <Text style={{ fontSize: 14, color: '#4b5563', textAlign: 'center' }}>Dispenser is now unlocked</Text>
                      </View>
                      <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 16 }}>
                        <Text style={{ fontSize: 12, color: '#4b5563', marginBottom: 4 }}>MGL Hind Station</Text>
                        <Text style={{ fontWeight: '600', color: '#111827' }}>Pre-authorized: ₹1,200</Text>
                      </View>
                      <View style={{ backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fcd34d', borderRadius: 16, padding: 12 }}>
                        <Text style={{ fontSize: 12, color: '#78350f' }}>⚠ Do not leave the pump until fueling is complete</Text>
                      </View>
                      <View style={{ backgroundColor: '#f9fafb', borderRadius: 16, padding: 16, alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#4b5563', marginBottom: 4 }}>Dispensing</Text>
                        <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{dispensingAmount > 0 ? dispensingAmount : 2.4} kg</Text>
                        <Text style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>₹{dispensingAmount > 0 ? Math.round(dispensingAmount * 160) : 384}</Text>
                      </View>
                      <TouchableOpacity onPress={() => { setSessionState('complete'); setDispensingAmount(4.2); }} activeOpacity={0.7} style={{ backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Fueling Complete</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Scan Session: Complete */}
                  {sessionState === 'complete' && activeScanBinding && (
                    <View style={{ gap: 16, marginTop: 8 }}>
                      <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' }}>
                        <View style={{ width: 48, height: 48, backgroundColor: '#dcfce7', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                          <Check size={24} color="#15803d" />
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Fueling Complete</Text>
                        <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: '#e5e7eb', marginTop: 8, paddingTop: 16, gap: 8 }}>
                          {[
                            { label: 'Station', value: 'MGL Hind Station' },
                            { label: 'Vehicle', value: activeScanBinding.vrn },
                            { label: 'Quantity', value: '4.2 kg', bold: true },
                          ].map((row) => (
                            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={{ fontSize: 14, color: '#4b5563' }}>{row.label}</Text>
                              <Text style={{ fontSize: 14, fontWeight: row.bold ? '700' : '600', color: '#111827' }}>{row.value}</Text>
                            </View>
                          ))}
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 8 }}>
                            <Text style={{ fontWeight: '700', color: '#111827' }}>Amount</Text>
                            <Text style={{ fontWeight: '700', color: '#15803d' }}>₹672</Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => { setSessionState('idle'); setActiveTab('card'); setActiveScanBinding(null); }}
                        activeOpacity={0.7}
                        style={{ backgroundColor: '#15803d', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* Assignments Tab */}
              {activeTab === 'assignments' && (
                <View style={{ padding: 16, gap: 16 }}>
                  <View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>My Assignments</Text>
                    <Text style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>{activeBindings.length} active · {pendingBindings.length + repairBindings.length} need attention</Text>
                  </View>

                  {activeBindings.length > 0 && (
                    <View style={{ gap: 12 }}>
                      <Text style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: '700', color: '#6b7280', letterSpacing: 1 }}>Active</Text>
                      {activeBindings.map((binding) => (
                        <View key={binding.id}>
                          {binding.authMode === 'vehicle_linked' && (
                            <View style={{ borderLeftWidth: 4, borderLeftColor: '#15803d', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
                              <View style={{ padding: 20, minHeight: 160, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <Text style={{ fontSize: 11, color: '#374151', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>{binding.fo}</Text>
                                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#15803d' }}>MGL</Text>
                                  </View>
                                </View>
                                <Text style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 20, color: '#111827', letterSpacing: 3, marginVertical: 12 }}>{binding.vrn}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#15803d' }}>Vehicle-linked</Text>
                                  </View>
                                  <Text style={{ fontSize: 12, color: '#4b5563' }}>Active</Text>
                                </View>
                              </View>
                              <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 12 }}>
                                <TouchableOpacity onPress={() => { setSessionState('scanning'); setActiveTab('scan'); }} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, backgroundColor: '#f0fdf4', borderRadius: 12 }}>
                                  <QrCode size={20} color="#15803d" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#15803d' }}>Scan & Pay</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('transactions')} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, backgroundColor: '#f9fafb', borderRadius: 12 }}>
                                  <History size={20} color="#6b7280" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280' }}>Transactions</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                          {binding.authMode === 'shift_based' && binding.scanPayStatus === 'in_window' && (
                            <View style={{ borderLeftWidth: 4, borderLeftColor: '#f59e0b', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
                              <View style={{ padding: 20, minHeight: 160, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <Text style={{ fontSize: 11, color: '#374151', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>{binding.fo}</Text>
                                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#b45309' }}>MGL</Text>
                                  </View>
                                </View>
                                <Text style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 20, color: '#111827', letterSpacing: 3, marginVertical: 12 }}>{binding.vrn}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#b45309' }}>{`Shift · ends ${binding.shiftEnd}`}</Text>
                                  </View>
                                  <Text style={{ fontSize: 12, color: '#4b5563' }}>{binding.shiftEndsIn}</Text>
                                </View>
                              </View>
                              <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 12 }}>
                                <TouchableOpacity onPress={() => { setSessionState('scanning'); setActiveTab('scan'); }} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, backgroundColor: '#f0fdf4', borderRadius: 12 }}>
                                  <QrCode size={20} color="#15803d" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#15803d' }}>Scan & Pay</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('transactions')} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, backgroundColor: '#f9fafb', borderRadius: 12 }}>
                                  <History size={20} color="#6b7280" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280' }}>Transactions</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setShowShiftSchedule(true); setSelectedShiftBinding(binding); }} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, backgroundColor: '#f9fafb', borderRadius: 12 }}>
                                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round">
                                    <Rect x="3" y="4" width="18" height="18" rx="2" />
                                    <Line x1="16" y1="2" x2="16" y2="6" />
                                    <Line x1="8" y1="2" x2="8" y2="6" />
                                    <Line x1="3" y1="10" x2="21" y2="10" />
                                  </Svg>
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280' }}>Schedule</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                          {binding.authMode === 'trip_linked' && binding.scanPayStatus === 'in_window' && (
                            <View style={{ borderLeftWidth: 4, borderLeftColor: '#2563eb', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
                              <View style={{ padding: 20, minHeight: 160, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <Text style={{ fontSize: 11, color: '#374151', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>{binding.fo}</Text>
                                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#1d4ed8' }}>MGL</Text>
                                  </View>
                                </View>
                                <Text style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 20, color: '#111827', letterSpacing: 3, marginVertical: 12 }}>{binding.vrn}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <View style={{ backgroundColor: '#dbeafe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#1d4ed8' }}>{`Trip · ends ${binding.tripEnd}`}</Text>
                                  </View>
                                  <Text style={{ fontSize: 12, color: '#4b5563' }} numberOfLines={1}>{`${binding.origin} → ${binding.destination}`}</Text>
                                </View>
                              </View>
                              <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 12 }}>
                                <TouchableOpacity onPress={() => { setSessionState('scanning'); setActiveTab('scan'); }} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, backgroundColor: '#f0fdf4', borderRadius: 12 }}>
                                  <QrCode size={20} color="#15803d" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#15803d' }}>Scan & Pay</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('transactions')} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, backgroundColor: '#f9fafb', borderRadius: 12 }}>
                                  <History size={20} color="#6b7280" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280' }}>Transactions</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setShowTripDetails(true); setSelectedTripBinding(binding); }} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, backgroundColor: '#f9fafb', borderRadius: 12 }}>
                                  <MapPin size={20} color="#6b7280" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280' }}>Trip details</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}

                  {pendingBindings.length > 0 && (
                    <View style={{ gap: 12 }}>
                      <Text style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: '700', color: '#6b7280', letterSpacing: 1 }}>Pending</Text>
                      {pendingBindings.map((binding) => (
                        <View key={binding.id} style={{ borderWidth: 1, borderColor: '#fde68a', backgroundColor: '#fffbeb', borderRadius: 12, padding: 16, gap: 12 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Text style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 18, color: '#111827' }}>{binding.vrn}</Text>
                            <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
                              <Text style={{ fontSize: 12, fontWeight: '700', color: '#b45309' }}>Pending acceptance</Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 14, color: '#4b5563' }}>{binding.fo}</Text>
                          {binding.assignedBy && <Text style={{ fontSize: 12, color: '#4b5563' }}>Assigned by {binding.assignedBy}</Text>}
                          <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                              onPress={() => { setActiveAssignment(binding); setCurrentMainScreen('assignment_notification'); }}
                              activeOpacity={0.7}
                              style={{ flex: 1, backgroundColor: '#15803d', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}
                            >
                              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>View & Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => setDeclineBndId(binding.id)}
                              activeOpacity={0.7}
                              style={{ flex: 1, borderWidth: 1, borderColor: '#fca5a5', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}
                            >
                              <Text style={{ color: '#dc2626', fontWeight: '600', fontSize: 13 }}>Decline</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {repairBindings.length > 0 && (
                    <View style={{ gap: 12 }}>
                      <Text style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: '700', color: '#6b7280', letterSpacing: 1 }}>Re-pair Required</Text>
                      {repairBindings.map((binding) => (
                        <View key={binding.id} style={{ borderWidth: 2, borderColor: '#fca5a5', borderStyle: 'dashed', backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 12 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Text style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 18, color: '#111827' }}>{binding.vrn}</Text>
                            <View style={{ backgroundColor: '#fef2f2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
                              <Text style={{ fontSize: 12, fontWeight: '700', color: '#dc2626' }}>Re-pair required</Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 14, color: '#4b5563' }}>{binding.authMode === 'shift_based' ? 'Shift-based' : 'Vehicle-linked'} · {binding.fo}</Text>
                          {binding.repairReason && <Text style={{ fontSize: 12, color: '#4b5563' }}>Reason: {binding.repairReason}</Text>}
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Lock size={16} color="#dc2626" />
                            <Text style={{ fontSize: 14, color: '#dc2626' }}>Scan & Pay locked until re-paired</Text>
                          </View>
                          <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12 }}>
                            <TouchableOpacity
                              onPress={() => { setActiveAssignment(binding); setCurrentMainScreen('pairing_code'); }}
                              activeOpacity={0.7}
                              style={{ borderWidth: 1, borderColor: '#fcd34d', borderRadius: 8, paddingVertical: 10, alignItems: 'center', backgroundColor: '#fffbeb' }}
                            >
                              <Text style={{ color: '#b45309', fontSize: 13, fontWeight: '600' }}>Enter new pairing code</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {(activeBindings.length > 0 || pendingBindings.length > 0 || repairBindings.length > 0) && (
                    <View style={{ gap: 12, paddingTop: 8 }}>
                      <TouchableOpacity
                        onPress={() => setExpandPastAssignments(!expandPastAssignments)}
                        activeOpacity={0.7}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}
                      >
                        <Text style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: '700', color: '#4b5563', letterSpacing: 1 }}>Show past assignments</Text>
                        <ChevronDown size={16} color="#4b5563" />
                      </TouchableOpacity>
                      {expandPastAssignments && (
                        <View style={{ gap: 8 }}>
                          {[
                            { vrn: 'MH 10 MN 1111', type: 'Trip-linked · ABC Logistics', date: 'Ended 10 Apr 2026', badge: 'Expired' },
                            { vrn: 'MH 12 PQ 2222', type: 'Vehicle-linked · Quick Movers', date: 'Revoked 01 Mar 2026', badge: 'Revoked' },
                          ].map((item) => (
                            <View key={item.vrn} style={{ borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, gap: 8 }}>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'monospace', fontWeight: '600', color: '#374151' }}>{item.vrn}</Text>
                                <View style={{ backgroundColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 }}>
                                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151' }}>{item.badge}</Text>
                                </View>
                              </View>
                              <Text style={{ fontSize: 12, color: '#4b5563' }}>{item.type}</Text>
                              <Text style={{ fontSize: 12, color: '#4b5563' }}>{item.date}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}

                  {activeBindings.length === 0 && pendingBindings.length === 0 && repairBindings.length === 0 && (
                    <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                      <Route size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
                      <Text style={{ fontWeight: '600', color: '#4b5563', marginBottom: 4 }}>No assignments yet</Text>
                      <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>Your Fleet Operator will assign vehicles and trips here</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }} contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
                    {[{ key: 'all', label: 'All' }, { key: 'successful', label: 'Successful' }, { key: 'failed', label: 'Failed' }].map(f => (
                      <TouchableOpacity
                        key={f.key}
                        onPress={() => setTxnFilter(f.key as typeof txnFilter)}
                        activeOpacity={0.7}
                        style={{ paddingHorizontal: 16, paddingVertical: 6, borderRadius: 99, backgroundColor: txnFilter === f.key ? '#16a34a' : '#f3f4f6' }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: '600', color: txnFilter === f.key ? '#fff' : '#4b5563' }}>{f.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={{ padding: 16, gap: 8 }}>
                    {mockTransactions.filter(t => {
                      if (txnFilter === 'all') return true;
                      if (txnFilter === 'successful') return t.status === 'Success';
                      if (txnFilter === 'failed') return t.status === 'Failed';
                      return true;
                    }).map((txn) => (
                      <View key={txn.id} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{txn.station}</Text>
                            <Text style={{ fontSize: 12, color: '#4b5563' }}>{txn.vrn}</Text>
                          </View>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: txn.type === 'Fueling' ? '#dc2626' : '#16a34a' }}>
                            {txn.type === 'Fueling' ? '-' : '+'}₹{txn.amount}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#4b5563' }}>{txn.date}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <View style={{ padding: 16, paddingBottom: 32 }}>
                  <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <View style={{ width: 64, height: 64, backgroundColor: '#bbf7d0', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                      <Text style={{ fontSize: 24, fontWeight: '700', color: '#15803d' }}>S</Text>
                    </View>
                    <Text style={{ fontWeight: '700', color: '#111827', fontSize: 16 }}>Suresh Kumar</Text>
                    <Text style={{ fontSize: 12, color: '#4b5563' }}>Driver · ABC Logistics</Text>
                  </View>

                  <View style={{ gap: 16 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' }}>
                      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
                        <Text style={{ fontWeight: '700', color: '#111827' }}>Account Details</Text>
                      </View>
                      {[
                        { label: 'Mobile', value: `+91 ${mobileNumber || DRIVER.mobile}` },
                        { label: 'Driver ID', value: 'DRV-00123' },
                        { label: 'Registered', value: '12 Jan 2025' },
                      ].map((row, i, arr) => (
                        <View key={row.label} style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: '#e5e7eb' }}>
                          <Text style={{ fontSize: 14, color: '#4b5563' }}>{row.label}</Text>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{row.value}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' }}>
                      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
                        <Text style={{ fontWeight: '700', color: '#111827' }}>My Vehicles</Text>
                      </View>
                      {pairedVehicles.map((vehicle, idx) => (
                        <View key={idx} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: idx < pairedVehicles.length - 1 ? 1 : 0, borderBottomColor: '#e5e7eb' }}>
                          <Text style={{ fontWeight: '600', color: '#111827', fontSize: 14 }}>{vehicle.vrn}</Text>
                          <Text style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>{vehicle.company}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                            <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                              <Text style={{ fontSize: 12, fontWeight: '600', color: '#15803d' }}>{vehicle.authMode}</Text>
                            </View>
                            <View style={{ width: 8, height: 8, backgroundColor: '#16a34a', borderRadius: 4 }} />
                          </View>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      onPress={handleLogout}
                      activeOpacity={0.7}
                      style={{ borderWidth: 2, borderColor: '#fca5a5', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
                    >
                      <Text style={{ color: '#dc2626', fontWeight: '600' }}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={{ borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 72, paddingHorizontal: 8 }}>
              {[
                { id: 'card', Icon: Home, label: 'Home' },
                { id: 'scan', Icon: QrCode, label: 'Scan & Pay' },
                { id: 'assignments', Icon: Route, label: 'Assignments' },
                { id: 'profile', Icon: User, label: 'Profile' },
              ].map(({ id, Icon, label }) => (
                <TouchableOpacity
                  key={id}
                  onPress={() => setActiveTab(id as typeof activeTab)}
                  activeOpacity={0.7}
                  style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8 }}
                >
                  <Icon size={24} color={activeTab === id ? '#15803d' : '#6b7280'} />
                  <Text style={{ fontSize: 11, fontWeight: '600', color: activeTab === id ? '#15803d' : '#6b7280' }}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Global Modals */}

        <Modal visible={showShiftSchedule && !!selectedShiftBinding} transparent animationType="slide" onRequestClose={() => { setShowShiftSchedule(false); setSelectedShiftBinding(null); }}>
          <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => { setShowShiftSchedule(false); setSelectedShiftBinding(null); }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, gap: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Shift schedule</Text>
                <TouchableOpacity onPress={() => { setShowShiftSchedule(false); setSelectedShiftBinding(null); }} activeOpacity={0.7}>
                  <X size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
              {selectedShiftBinding && (
                <ScrollView style={{ maxHeight: 300 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                    <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#4b5563' }}>Day</Text>
                    <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#4b5563' }}>Start</Text>
                    <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#4b5563' }}>End</Text>
                  </View>
                  {selectedShiftBinding.shiftDays?.map((day) => (
                    <View key={day} style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingVertical: 8 }}>
                      <Text style={{ flex: 1, fontSize: 14, color: '#111827' }}>{day}</Text>
                      <Text style={{ flex: 1, fontSize: 14, color: '#111827', fontFamily: 'monospace' }}>{selectedShiftBinding.shiftStart}</Text>
                      <Text style={{ flex: 1, fontSize: 14, color: '#111827', fontFamily: 'monospace' }}>{selectedShiftBinding.shiftEnd}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </Pressable>
        </Modal>

        <Modal visible={showTripDetails && !!selectedTripBinding} transparent animationType="slide" onRequestClose={() => { setShowTripDetails(false); setSelectedTripBinding(null); }}>
          <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => { setShowTripDetails(false); setSelectedTripBinding(null); }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, gap: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Trip details</Text>
                <TouchableOpacity onPress={() => { setShowTripDetails(false); setSelectedTripBinding(null); }} activeOpacity={0.7}>
                  <X size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
              {selectedTripBinding && (
                <View style={{ gap: 0 }}>
                  {[
                    { label: 'Vehicle', value: selectedTripBinding.vrn },
                    { label: 'Date', value: selectedTripBinding.tripDate },
                    { label: 'Window', value: `${selectedTripBinding.tripStart} – ${selectedTripBinding.tripEnd}` },
                    { label: 'From', value: selectedTripBinding.origin },
                    { label: 'To', value: selectedTripBinding.destination },
                    { label: 'Notes', value: 'Client delivery' },
                  ].map((row, i, arr) => (
                    <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: '#f3f4f6' }}>
                      <Text style={{ fontSize: 14, color: '#4b5563' }}>{row.label}</Text>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{row.value || '—'}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Pressable>
        </Modal>

        <Modal visible={!!declineBndId} transparent animationType="fade" onRequestClose={() => setDeclineBndId(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, gap: 16, width: '100%', maxWidth: 360 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Decline this assignment?</Text>
              <Text style={{ fontSize: 14, color: '#4b5563' }}>This will notify your Fleet Operator.</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <TouchableOpacity onPress={() => setDeclineBndId(null)} activeOpacity={0.7} style={{ flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}>
                  <Text style={{ color: '#374151', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDeclineBndId(null)} activeOpacity={0.7} style={{ flex: 1, backgroundColor: '#dc2626', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Yes, decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
