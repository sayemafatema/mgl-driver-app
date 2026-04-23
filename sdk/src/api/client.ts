import type { Binding, Driver, Transaction, PairedVehicle, MGLConfig } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MOCK_DRIVER: Driver = {
  id: 'DRV001',
  name: 'Ravi Sharma',
  initials: 'RS',
  mobile: '9876501234',
  maskedMobile: '+91 ••••••1234',
  registered: true,
};

export const MOCK_BINDINGS: Binding[] = [
  { id: 'BND001', vrn: 'MH 02 AB 1234', fo: 'ABC Logistics Pvt. Ltd.', authMode: 'vehicle_linked', state: 'ACTIVE', paired: true, scanPayStatus: 'always_available', balance: 14600, cardBalance: 12500, incentiveBalance: 2100, spendLimit: 2000 },
  { id: 'BND002', vrn: 'MH 02 CD 5678', fo: 'ABC Logistics Pvt. Ltd.', authMode: 'shift_based', state: 'ACTIVE', paired: true, scanPayStatus: 'in_window', shiftDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], shiftStart: '06:00', shiftEnd: '14:00', shiftEndsIn: '3h 20m', balance: 8200, cardBalance: 8200, incentiveBalance: 0, spendLimit: 1500 },
  { id: 'BND003', vrn: 'MH 04 GH 9012', fo: 'ABC Logistics Pvt. Ltd.', authMode: 'trip_linked', state: 'ACTIVE', paired: true, scanPayStatus: 'in_window', tripDate: 'Today', tripStart: '08:00', tripEnd: '18:00', tripEndsIn: '7h 20m', origin: 'Andheri East', destination: 'Pune', balance: 5400, cardBalance: 5400, incentiveBalance: 0, spendLimit: 3000 },
  { id: 'BND004', vrn: 'MH 06 EF 3456', fo: 'ABC Logistics Pvt. Ltd.', authMode: 'vehicle_linked', state: 'PENDING_ACCEPTANCE', paired: false, scanPayStatus: 'locked_unpaired', balance: 0, spendLimit: 2000, assignedBy: 'Ramesh Shah', validPairingCode: '234567', cardBalance: 0, incentiveBalance: 0 },
  { id: 'BND005', vrn: 'MH 08 KL 7890', fo: 'XYZ Transport', authMode: 'shift_based', state: 'ACTIVE', paired: false, scanPayStatus: 'locked_repair', shiftDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], shiftStart: '22:00', shiftEnd: '06:00', repairReason: 'Monthly re-verification', balance: 3200, spendLimit: 1000, validPairingCode: '345678', cardBalance: 3200, incentiveBalance: 0 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN001', station: 'MGL Hind CNG Filling', vrn: 'MH 02 AB 1234', amount: 672, date: 'Mar 23, 10:30 AM', type: 'Fueling', quantity: '4.2 kg', status: 'Success' },
  { id: 'TXN002', station: 'NEFT Credit', vrn: 'MH 02 AB 1234', amount: 10000, date: 'Mar 22, 02:15 PM', type: 'Credit', status: 'Success' },
  { id: 'TXN003', station: 'MGL Kurla Station', vrn: 'MH 02 CD 5678', amount: 1200, date: 'Mar 21, 08:45 AM', type: 'Fueling', quantity: '7.5 kg', status: 'Success' },
  { id: 'TXN004', station: 'MGL Andheri East', vrn: 'MH 02 AB 1234', amount: 950, date: 'Mar 20, 06:20 PM', type: 'Fueling', quantity: '6.0 kg', status: 'Success' },
];

export const MOCK_PAIRED_VEHICLES: PairedVehicle[] = [
  { vrn: 'MH 02 AB 1234', company: 'ABC Logistics Pvt. Ltd.', authMode: 'Vehicle-linked', balance: 14600, limit: 2000 },
  { vrn: 'MH 02 CD 5678', company: 'XYZ Transport', authMode: 'Day shift 06:00-14:00', balance: 8500, limit: 1500 },
];

export const MOCK_INVITE_CODES: Record<string, string> = {
  'ABC123': 'ABC Logistics Pvt. Ltd.',
  'XYZ789': 'XYZ Transport',
};

export function buildClient(config: MGLConfig) {
  const isMock = config.mockMode === true || !config.baseUrl;
  const base = config.baseUrl || '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (config.apiKey) headers['X-API-Key'] = config.apiKey;

  async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${base}${path}`, { ...options, headers: { ...headers, ...options?.headers } });
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json() as T;
  }

  return {
    async requestOtp(mobile: string): Promise<{ success: boolean }> {
      if (isMock) { await delay(400); return { success: true }; }
      return apiFetch('/auth/otp/request', { method: 'POST', body: JSON.stringify({ mobile }) });
    },
    async verifyOtp(mobile: string, otp: string): Promise<{ valid: boolean; registered: boolean; returningUser: boolean }> {
      if (isMock) { await delay(500); return { valid: otp === '123456', registered: true, returningUser: true }; }
      return apiFetch('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ mobile, otp }) });
    },
    async verifyPin(pin: string): Promise<{ valid: boolean; attemptsLeft: number }> {
      if (isMock) { await delay(300); return { valid: pin === '123456', attemptsLeft: pin === '123456' ? 3 : 2 }; }
      return apiFetch('/auth/pin/verify', { method: 'POST', body: JSON.stringify({ pin }) });
    },
    async setPin(pin: string): Promise<{ success: boolean }> {
      if (isMock) { await delay(400); return { success: true }; }
      return apiFetch('/auth/pin/set', { method: 'POST', body: JSON.stringify({ pin }) });
    },
    async getDriver(): Promise<Driver> {
      if (isMock) { await delay(200); return MOCK_DRIVER; }
      return apiFetch('/driver/me');
    },
    async getBindings(): Promise<Binding[]> {
      if (isMock) { await delay(300); return MOCK_BINDINGS; }
      return apiFetch('/driver/bindings');
    },
    async acceptBinding(id: string): Promise<{ success: boolean }> {
      if (isMock) { await delay(400); return { success: true }; }
      return apiFetch(`/driver/bindings/${id}/accept`, { method: 'POST' });
    },
    async verifyPairingCode(bindingId: string, code: string): Promise<{ valid: boolean }> {
      if (isMock) {
        await delay(600);
        const binding = MOCK_BINDINGS.find(b => b.id === bindingId);
        return { valid: binding?.validPairingCode === code };
      }
      return apiFetch(`/driver/bindings/${bindingId}/pair`, { method: 'POST', body: JSON.stringify({ code }) });
    },
    async getTransactions(): Promise<Transaction[]> {
      if (isMock) { await delay(300); return MOCK_TRANSACTIONS; }
      return apiFetch('/driver/transactions');
    },
    async getPairedVehicles(): Promise<PairedVehicle[]> {
      if (isMock) { await delay(200); return MOCK_PAIRED_VEHICLES; }
      return apiFetch('/driver/vehicles');
    },
    async validateInviteCode(code: string): Promise<{ valid: boolean; companyName?: string }> {
      if (isMock) {
        await delay(200);
        const company = MOCK_INVITE_CODES[code];
        return { valid: !!company, companyName: company };
      }
      return apiFetch('/auth/invite/validate', { method: 'POST', body: JSON.stringify({ code }) });
    },
    async startFuelingSession(bindingId: string, pin: string): Promise<{ sessionId: string; preAuthorizedAmount: number }> {
      if (isMock) { await delay(500); return { sessionId: `SES-${Date.now()}`, preAuthorizedAmount: 1200 }; }
      return apiFetch('/fueling/session/start', { method: 'POST', body: JSON.stringify({ bindingId, pin }) });
    },
    async completeFuelingSession(sessionId: string): Promise<{ amount: number; quantity: number }> {
      if (isMock) { await delay(400); return { amount: 672, quantity: 4.2 }; }
      return apiFetch(`/fueling/session/${sessionId}/complete`, { method: 'POST' });
    },
  };
}

export type MGLClient = ReturnType<typeof buildClient>;
