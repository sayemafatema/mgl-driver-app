import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthMode = 'vehicle_linked' | 'shift_based' | 'trip_linked';
export type BindingState = 'ACTIVE' | 'PENDING_ACCEPTANCE' | 'INACTIVE';
export type ScanPayStatus =
  | 'always_available'
  | 'in_window'
  | 'out_of_window'
  | 'locked_unpaired'
  | 'locked_repair'
  | 'locked_pending';

export interface Binding {
  id: string;
  vrn: string;
  fo: string;
  authMode: AuthMode;
  state: BindingState;
  paired: boolean;
  scanPayStatus: ScanPayStatus;
  balance: number;
  cardBalance: number;
  incentiveBalance: number;
  spendLimit: number;
  shiftDays?: string[];
  shiftStart?: string;
  shiftEnd?: string;
  shiftEndsIn?: string;
  tripDate?: string;
  tripStart?: string;
  tripEnd?: string;
  tripEndsIn?: string;
  origin?: string;
  destination?: string;
  repairReason?: string;
  assignedBy?: string;
  validPairingCode?: string;
}

export interface PendingBinding {
  id: string;
  vrn: string;
  fo: string;
  assignedBy: string;
}

export interface Driver {
  id: string;
  name: string;
  initials: string;
  mobile: string;
  maskedMobile: string;
  registered: boolean;
}

export interface Transaction {
  id: string;
  station: string;
  vrn: string;
  amount: number;
  date: string;
  type: string;
  quantity?: string;
  status: string;
}

export interface PairedVehicle {
  vrn: string;
  company: string;
  authMode: string;
  balance: number;
  limit: number;
}

export interface MGLConfig {
  baseUrl?: string;
  apiKey?: string;
  mockMode?: boolean;
  theme?: { primaryColor?: string; logoSource?: number };
}

export interface MGLContextValue {
  config: MGLConfig;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export type SessionState = 'idle' | 'scanning' | 'confirmation' | 'otp_entry' | 'authorized' | 'complete';
export type TxnFilter = 'all' | 'successful' | 'failed';

export type SetPinMode = 'onboarding' | 'reset';

export type AuthStackParamList = {
  Login: undefined;
  LoginOtp: undefined;
  PinLogin: undefined;
  ForgotPin: undefined;
  ForgotOtp: undefined;
  InviteCode: undefined;
  InviteConfirm: undefined;
  OnboardingOtp: undefined;
  SetPin: { mode: SetPinMode };
  ConfirmPin: { mode: SetPinMode };
  Registered: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Scan: undefined;
  Assignments: undefined;
  Transactions: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<MainTabParamList>;
  AssignmentNotification: { bindingId: string };
  PairingCode: { bindingId: string };
  AssignmentAccepted: { bindingId: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};
