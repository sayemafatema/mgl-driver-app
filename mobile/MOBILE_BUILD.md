# MGL Fleet Connect — Mobile Build Guide

This folder contains the Expo React Native app that produces an installable **APK** (Android) and **IPA** (iOS) via Expo EAS Build — no local Android Studio or Xcode required.

---

## Prerequisites

| Tool | Install |
|------|---------|
| Node.js 18+ | https://nodejs.org |
| EAS CLI | `npm install -g eas-cli` |
| Expo account (free) | https://expo.dev/signup |

---

## One-time setup

```bash
# Inside the mobile/ directory
cd mobile
npm install

# Login to your Expo account
eas login

# Link this project to Expo (first time only — creates the project on expo.dev)
eas init
```

> **Tip:** `eas init` will create a new project on expo.dev and write the
> `projectId` into `app.json` automatically. If you are re-linking an existing
> project, run `eas init --id <your-existing-project-id>` instead.

---

## Build an Android APK (direct install, no Play Store)

```bash
cd mobile
eas build --profile preview --platform android
```

- The build runs in Expo's cloud (takes ~10–15 min)
- When complete, you get a download link for the `.apk` file
- Transfer the `.apk` to any Android device and install it directly
- No Google account or Play Store needed

---

## Build an iOS IPA (internal distribution)

```bash
cd mobile
eas build --profile preview --platform ios
```

### iOS requirements

| Requirement | Details |
|-------------|---------|
| Apple Developer account | Free tier works for simulator; **paid ($99/yr)** needed for device install |
| Device UDID registration | Needed for ad-hoc distribution to specific iPhones/iPads |
| Code signing | EAS handles this automatically once you're logged in with Apple credentials |

> **Without an Apple Developer account:** You cannot install an IPA on a real device.
> You can still test the app in Expo Go on iOS:
> `npx expo start` → scan QR with Expo Go app.

---

## Run locally with Expo Go (fastest for testing)

```bash
cd mobile
npm start
```

Then scan the QR code with the **Expo Go** app (available on App Store and Google Play).
This does **not** require building an APK/IPA.

---

## Production builds (App Store / Play Store)

### Android (Google Play)
```bash
eas build --profile production --platform android
```
Produces an `.aab` (Android App Bundle) for uploading to Google Play.

### iOS (App Store)
```bash
eas build --profile production --platform ios
```
Requires a paid Apple Developer account and App Store Connect setup.

---

## Project structure

```
mobile/
├── app/
│   ├── _layout.tsx      # Root layout (Expo Router)
│   └── index.tsx        # Main app (all screens)
├── assets/
│   ├── mgl-logo.png     # App logo / splash
│   └── icon.png         # App icon
├── app.json             # Expo config (name, bundle IDs, icons)
├── eas.json             # EAS build profiles
├── package.json         # Dependencies
├── tailwind.config.js   # NativeWind / Tailwind config
└── MOBILE_BUILD.md      # This file
```

---

## Mock credentials (for testing)

| Field | Value |
|-------|-------|
| Mobile number | Any 10-digit number |
| OTP | `123456` |
| PIN | `123456` |
| Invite code | `ABC123` or `XYZ789` |
| Pairing code | `234567` (for BND004) |

---

## Troubleshooting

**"eas: command not found"**
→ Run `npm install -g eas-cli` and make sure `~/.npm-global/bin` is in your `PATH`.

**Build fails with "No credentials"**
→ Run `eas credentials` to set up signing credentials for your platform.

**iOS build succeeds but IPA won't install on device**
→ Your device's UDID must be registered in your Apple Developer portal.
→ Run `eas device:create` to register a new device.

**App crashes on launch**
→ Run `npx expo start` and check the Metro bundler output for JS errors.
