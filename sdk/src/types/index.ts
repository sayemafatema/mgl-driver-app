export type AuthMode = 'vehicle_linked' | 'shift_based' | 'trip_linked';
export type BindingState = 'ACTIVE' | 'PENDING_ACCEPTANCE' | 'REVOKED' | 'EXPIRED';
export type ScanPayStatus =
  | 'always_available'
  | 'in_window'
  | 'trip_window'
  | 'locked_unpaired'
  | 'locked_repair'
  | 'out_of_window';

export interface Binding {
  id: string;
  vrn: string;
  fo: string;
  authMode: AuthMode;
  state: BindingState;
  paired: boolean;
  scanPayStatus: string;
  balance: number;
  cardBalance?: number;
  incentiveBalance?: number;
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
  type: 'Fueling' | 'Credit';
  quantity?: string;
  status: 'Success' | 'Failed' | 'Pending';
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
  theme?: {
    primaryColor?: string;
    logoSource?: number;
  };
}

export type OnboardingStep =
  | 'login'
  | 'login_otp'
  | 'pin_login'
  | 'set_pin'
  | 'confirm_pin'
  | 'complete'
  | 'forgot_pin'
  | 'forgot_otp'
  | 'invite_code'
  | '1c'
  | '1d'
  | '1e'
  | '1f'
  | 'registered';

export type ActiveTab = 'card' | 'scan' | 'assignments' | 'transactions' | 'profile';
export type MainScreen =
  | 'home_empty'
  | 'home_active'
  | 'assignment_notification'
  | 'pairing_code'
  | 'assignment_accepted';
export type SessionState =
  | 'idle'
  | 'scanning'
  | 'confirmation'
  | 'otp_entry'
  | 'authorized'
  | 'complete';
export type TxnFilter = 'all' | 'successful' | 'failed';

export interface DetailRow {
  label: string;
  value: string;
  valueColor?: string;
}
