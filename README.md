# Janggi (장기)

Korean Janggi mobile app built with **Expo**, **React Native**, and **TypeScript**. Play vs AI or local two-player, with full rule support, career progression, and EN/KO localization.

## Features

### Gameplay

- Standard 9×10 board with palace diagonals
- Pre-game horse ↔ elephant swap
- Full piece movement (chariot, cannon jump, horse/elephant blockers, palace rules)
- Check / checkmate filtering, pass turn, bikjang (draw)
- Score-based endgame (deom / 듬) with Han komi
- Captured-piece trays, last-move highlight, move sound
- **vs AI** or **2 Players** local

### AI

Three difficulty levels: **Easy**, **Medium**, **Hard** (`src/game/aiDifficulty.ts`).

### Career mode (승진제)

Climb from **Intern (인턴)** to **CEO (사장)** by winning vs AI. Wins are **cumulative at your current rank** — no win streak required. Losses keep progress; draws do not change the count. From **Deputy Director (차장)** onward, wins only count at higher AI difficulties.

| Current rank | Wins needed | Min AI difficulty |
|--------------|-------------|-------------------|
| Intern | 3 | — |
| Staff | 5 | — |
| Assistant Manager | 7 | — |
| Manager | 10 | — |
| Deputy Director | 5 | Medium+ |
| Director | 7 | Hard |
| Executive VP | 5 | Hard |

Career ladder UI: tap the rank badge on the main screen or open **Career** from Settings.

### Settings

- Language: English / Korean
- Player & AI avatars (10 portraits in `assets/avatars/`)
- Game mode, side, AI difficulty
- Career mode on/off

Settings (⚙) is available only on the **setup** screen before a game starts.

## Tech stack

- Expo SDK 57, Expo Router
- React 19, React Native 0.86
- `react-native-svg` (board), RN `Animated` (pieces & overlays)
- AsyncStorage (settings, career progress)
- Custom i18n (`src/i18n/`) with `{{placeholder}}` syntax

## Getting started

### Prerequisites

- Node.js 20+
- npm
- Android Studio (for Android emulator/device builds)
- [EAS CLI](https://docs.expo.dev/build/setup/) (optional, for cloud builds)

### Install & run

```bash
git clone <repo-url>
cd janggi-game
npm install
npm start
```

In another terminal:

```bash
# Android emulator
npm run android

# Physical Android device
npm run android:device
```

```bash
# iOS (macOS + Xcode)
npm run ios
```

### Clean build (Android)

After changing native config (e.g. package ID) or when builds act stale:

```bash
rm -rf android/app/build android/build android/.gradle .expo
cd android && ./gradlew clean && cd ..
npm run android
```

Clear Metro cache when JS bundles look wrong:

```bash
npx expo start --clear
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Build & run on Android |
| `npm run android:device` | Run on connected Android device |
| `npm run ios` | Build & run on iOS |
| `npm run verify:career` | Run career progression unit checks |

### First-time Android setup

If the `android/` folder is missing or you changed icons/splash assets:

```bash
npx expo prebuild --platform android --clean
npx expo run:android
```

## EAS Build

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
eas build --platform all --profile production
```

### OTA Update (JS-only changes)

```bash
eas update --channel production --message "Fix bug / update description"
```

## Storage keys

| Key | Purpose |
|-----|---------|
| `@janggi/game-settings` | Mode, side, difficulty, avatars, career toggle |
| `@janggi/career` | Rank, promotion wins, highest rank |
| `@janggi/locale` | `en` or `ko` |

## Development notes

- Game logic lives under `src/game/`; career is a **meta layer** on match results only (`src/career/careerProgress.ts`).
- Typecheck: `npx tsc --noEmit`
- Implementation plan: `.cursor/plans/janggi-mobile-app.mdc`

## License

Private project. Avatar artwork: see `assets/avatars/ATTRIBUTION.md`.
