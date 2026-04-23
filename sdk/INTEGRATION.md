# MGL Fleet Connect SDK — Integration Guide

**Package:** `@mgl/fleet-connect-sdk`  
**Version:** 0.1.0  
**Platform:** React Native (Expo or bare)

---

## What it does

Drop the SDK into any React Native app and your drivers get the full MGL Fleet Connect experience — login, OTP, PIN, vehicle assignments, scan-to-pay, transaction history, and profile — all inside a single modal with zero extra screens to build.

---

## Installation

### 1. Install the SDK

The SDK lives in the `sdk/` directory of this monorepo. Until it is published to npm (Task #7), reference it locally or via a git path.

**Local path (monorepo / same machine)**
```bash
# From your app directory
npm install ../path/to/sdk
# or
yarn add ../path/to/sdk
```

**Git URL**
```bash
npm install git+https://github.com/sayemafatema/mgl-driver-app.git#main:sdk
```

**npm (once published)**
```bash
npm install @mgl/fleet-connect-sdk
```

---

### 2. Install peer dependencies

The SDK does not bundle these — your app must have them installed.

```bash
npm install \
  react-native-svg \
  lucide-react-native \
  @react-navigation/native \
  @react-navigation/stack \
  @react-navigation/bottom-tabs \
  react-native-screens \
  react-native-safe-area-context \
  react-native-gesture-handler
```

**Expo apps** — the navigation gesture/screen libraries need native modules:
```bash
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

---

## Quick start (2 minutes)

This is the minimum integration. Everything else is optional.

```tsx
// App.tsx (or your root file)
import { MGLProvider, MGLLaunchButton } from '@mgl/fleet-connect-sdk';

export default function App() {
  return (
    <MGLProvider config={{ baseUrl: 'https://your-api.example.com', apiKey: 'YOUR_KEY' }}>
      {/* Place the button anywhere in your UI */}
      <MGLLaunchButton />
    </MGLProvider>
  );
}
```

That is the entire integration. The button opens a full-screen modal with all MGL screens inside. No routing changes needed in your app.

---

## Configuration

Pass a `config` object to `<MGLProvider>`:

```tsx
<MGLProvider config={config}>
```

| Option | Type | Required | Description |
|---|---|---|---|
| `baseUrl` | `string` | Yes (production) | Your MGL API base URL, e.g. `https://api.mgl.example.com` |
| `apiKey` | `string` | Recommended | API key sent with every request |
| `mockMode` | `boolean` | No | `true` → use built-in mock data; no real network calls |
| `theme.primaryColor` | `string` | No | Hex colour for buttons and accents (default: `#15803d`) |

### Mock mode (development / demo)

```tsx
<MGLProvider config={{ mockMode: true }}>
  <MGLLaunchButton />
</MGLProvider>
```

Mock credentials:
- **OTP:** `123456`
- **PIN:** `123456`
- **Invite code:** `ABC123` or `XYZ789`
- **Pairing code for BND004:** `234567`

---

## Components

### `<MGLLaunchButton>` — recommended

Self-contained. Renders both the trigger button and the modal internally.

```tsx
import { MGLLaunchButton } from '@mgl/fleet-connect-sdk';

<MGLLaunchButton
  label="Open Fleet Connect"        // default: 'Open MGL Fleet Connect'
  style={{ marginTop: 20 }}         // optional ViewStyle
  textStyle={{ fontSize: 14 }}      // optional TextStyle
/>
```

---

### `<MGLModal>` — advanced / controlled

Use this when you want to open the modal yourself (e.g. from a custom button or a deep-link).

**Uncontrolled** — SDK manages open/close state internally:

```tsx
import { MGLModal, useMGL } from '@mgl/fleet-connect-sdk';

function MyButton() {
  const { open } = useMGL();
  return (
    <>
      <Button onPress={open} title="Open MGL" />
      <MGLModal />
    </>
  );
}
```

**Controlled** — you manage the visibility:

```tsx
import { useState } from 'react';
import { MGLModal } from '@mgl/fleet-connect-sdk';

function MyScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)} title="Open MGL" />
      <MGLModal
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
```

> When `onClose` is provided, ALL internal close actions (the × button, logout, session end) call your handler — so your state always stays in sync.

---

### `useMGL()` hook

Access SDK state from anywhere inside `<MGLProvider>`.

```tsx
import { useMGL } from '@mgl/fleet-connect-sdk';

const { isOpen, open, close, config } = useMGL();
```

| Property | Type | Description |
|---|---|---|
| `isOpen` | `boolean` | Whether the MGL modal is currently open |
| `open` | `() => void` | Open the modal |
| `close` | `() => void` | Close the modal |
| `config` | `MGLConfig` | The config passed to MGLProvider |

---

## Typical integration patterns

### Pattern A — Button on home screen

```tsx
export default function HomeScreen() {
  return (
    <MGLProvider config={{ baseUrl: '...', apiKey: '...' }}>
      <View style={styles.container}>
        <Text>Welcome, Driver</Text>
        <MGLLaunchButton label="CNG Fleet" />
      </View>
    </MGLProvider>
  );
}
```

### Pattern B — Provider at app root, button deep in the tree

```tsx
// App.tsx
export default function App() {
  return (
    <MGLProvider config={{ baseUrl: '...', apiKey: '...' }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </MGLProvider>
  );
}

// Somewhere deep in the tree
function DriverDashboard() {
  return <MGLLaunchButton />;
}
```

### Pattern C — Open from a menu item (no visible button)

```tsx
function SideMenu() {
  const { open } = useMGL();
  return (
    <>
      <TouchableOpacity onPress={open}>
        <Text>Fleet Connect</Text>
      </TouchableOpacity>
      <MGLModal />
    </>
  );
}
```

---

## TypeScript

All types are exported from the package root:

```tsx
import type {
  MGLConfig,
  Binding,
  Driver,
  Transaction,
  PairedVehicle,
  AuthMode,
  BindingState,
} from '@mgl/fleet-connect-sdk';
```

---

## Screens included in the modal

The following screens are all rendered inside the modal — your app never navigates to them directly.

**Auth flow**
| Screen | Description |
|---|---|
| Login | Mobile number entry |
| LoginOtp | OTP verification |
| PinLogin | 6-digit PIN entry |
| ForgotPin / ForgotOtp | PIN reset flow |
| InviteCode / InviteConfirm | First-time driver onboarding |
| OnboardingOtp | Onboarding OTP |
| SetPin / ConfirmPin | PIN creation / reset |
| Registered | Success confirmation |

**Main tabs (post-login)**
| Tab | Description |
|---|---|
| Home | Vehicle binding cards, balances |
| Scan | Scan-to-pay session |
| Assignments | Pending vehicle assignments |
| Transactions | Fueling history with filters |
| Profile | Driver details, logout |

---

## Building / publishing the SDK

```bash
cd sdk
npm run build      # compiles src/ → dist/ and copies assets
npm run typecheck  # TypeScript check
npm publish        # publish to npm (requires npm login)
```

---

## Peer dependency versions

| Package | Minimum |
|---|---|
| react | 18.0.0 |
| react-native | 0.72.0 |
| react-native-svg | 13.0.0 |
| lucide-react-native | 0.460.0 |
| @react-navigation/native | 6.0.0 |
| @react-navigation/stack | 6.0.0 |
| @react-navigation/bottom-tabs | 6.0.0 |

---

## Troubleshooting

**"Could not find a declaration file for module '@mgl/fleet-connect-sdk'"**  
Run `npm run build` in the `sdk/` directory first so `dist/index.d.ts` is generated.

**Modal opens but shows blank screen**  
Ensure `react-native-screens` and `react-native-safe-area-context` are installed and that `<NavigationContainer>` wraps your app (the SDK uses its own internal `NavigationContainer` with `independent={true}`, so nesting is safe).

**Gesture handler errors**  
Add `import 'react-native-gesture-handler'` at the very top of your entry file (before any other imports).

**Network errors in production**  
Confirm `baseUrl` does not have a trailing slash and that `apiKey` is correct. Use `mockMode: true` to verify the UI works in isolation.
