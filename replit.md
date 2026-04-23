# MGL Fleet Connect — Driver App

## Overview

A fleet CNG fueling management app for drivers. Allows drivers to authenticate, manage vehicle assignments, and authorize fueling at MGL CNG stations via Scan & Pay.

## Project Structure

```
/                       Next.js web app (development preview)
├── app/
│   ├── page.tsx        Main app component (2400+ lines, all screens)
│   └── layout.tsx      Root layout
├── components/ui/      Shadcn/Radix UI components (unused by page.tsx)
├── public/             Static assets (mgl-logo.png, apple-icon.png)
│
mobile/                 Expo React Native demo app (uses the SDK)
├── app/
│   ├── index.tsx       SDK demo: <MGLProvider><MGLLaunchButton/><MGLModal/>
│   └── _layout.tsx     Expo Router root layout
├── assets/             App icons and splash (mgl-logo.png, icon.png)
├── app.json            Expo config
├── eas.json            EAS Build profiles (preview APK/IPA, production)
├── package.json        Expo + NativeWind + lucide-react-native deps
├── babel.config.js     Expo Babel config
└── MOBILE_BUILD.md     Step-by-step APK/IPA build instructions
│
sdk/                    @mgl/fleet-connect-sdk — publishable npm package
├── package.json        name: @mgl/fleet-connect-sdk, tsup build
├── tsconfig.json       TypeScript config (jsx: react-native)
├── tsup.config.ts      Bundle config (CJS + ESM + types)
└── src/
    ├── index.ts        Barrel exports: MGLProvider, MGLLaunchButton, MGLModal, useMGL
    ├── assets/
    │   └── mgl-logo.png
    ├── context/
    │   └── MGLContext.tsx   MGLProvider + useMGL hook + MGLConfig type
    └── components/
        ├── MGLApp.tsx        Full app (all screens + state, extracted from mobile)
        ├── MGLLaunchButton.tsx  Drop-in button — calls open() from context
        └── MGLModal.tsx      Full-screen modal wrapping MGLApp
```

## SDK Integration (App A)

Any React Native app can embed the full MGL experience with three lines:

```tsx
import { MGLProvider, MGLLaunchButton, MGLModal } from '@mgl/fleet-connect-sdk';
// or during development: from '../../sdk/src'

export default function App() {
  return (
    <MGLProvider config={{ mockMode: true }}>
      <MGLLaunchButton label="Open MGL Fleet Connect" />
      <MGLModal />
    </MGLProvider>
  );
}
```

The SDK is not yet published to npm — run `cd sdk && npm run build` to build the dist output locally.

## Running the Web App

```bash
pnpm run dev
```
Runs on port 5000. The web app simulates a phone frame in browser.

## Building APK / IPA

All mobile builds happen on Expo's cloud servers (EAS Build). See `mobile/MOBILE_BUILD.md` for full instructions.

```bash
cd mobile
npm install -g eas-cli
eas login
eas build --profile preview --platform android   # → .apk
eas build --profile preview --platform ios       # → .ipa (needs Apple Dev account)
```

## Running Mobile App Locally (Development)

```bash
cd mobile
npx expo start
```
Scan the QR code with Expo Go app on your phone.

## Tech Stack

### Web (Next.js)
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4
- Lucide React icons
- All mock data (no backend)

### Mobile (Expo React Native)
- Expo SDK 52, React Native 0.76
- Expo Router v4
- NativeWind v4 (Tailwind for React Native)
- lucide-react-native icons
- react-native-svg

## Mock Credentials

| Field | Value |
|-------|-------|
| OTP | `123456` |
| PIN | `123456` |
| Invite code | `ABC123` or `XYZ789` |
| Pairing code (BND004) | `234567` |

## App Screens

1. **Login** — Mobile number + OTP
2. **PIN Login** — Returning user PIN (6-digit)
3. **Set PIN / Confirm PIN** — First-time setup
4. **Forgot PIN** — OTP-based reset
5. **Invite Code** — New user registration via FO code
6. **Home (Card tab)** — Vehicle card carousel, balance, Scan & Pay CTA
7. **Scan & Pay tab** — QR scanner, PIN confirm, OTP, fueling session
8. **Assignments tab** — Active / pending / repair bindings
9. **Assignment Notification** — Accept/decline new assignment
10. **Pairing Code** — 6-digit vehicle pairing
11. **Transactions tab** — Fueling and credit history
12. **Profile tab** — Account info, vehicles, logout
