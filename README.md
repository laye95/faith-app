# Faith Generation

React Native (Expo) app for the Faith Generation Bible school.

## Prerequisites

- Node.js 18+
- npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (or use `npx`)
- iOS: Xcode (for simulator) or physical device
- Android: Android Studio (for emulator) or physical device

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd faith-app
npm install
```

### 2. Environment variables

Copy the example env file and fill in the values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `EXPO_PUBLIC_LOCAL_DEV_IP` | Your local IP (for dev builds connecting to local Supabase) |
| `EXPO_PUBLIC_STORYBLOK_ACCESS_TOKEN` | Storyblok API token for content |
| `EXPO_PUBLIC_VIMEO_ACCESS_TOKEN` | Vimeo API token for video playback |

For local development with Supabase, run `supabase start` in the project root and use the URLs from `supabase status`.

### 3. Start the app

```bash
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go on a physical device.

### 4. Run on device (development build)

For a development build with native modules:

```bash
npm run ios
# or
npm run android
```

## Project structure

- `app/` – File-based routes (Expo Router)
- `components/` – Shared UI components
- `hooks/` – Shared hooks
- `services/` – API services (Supabase, Storyblok, Vimeo)
- `types/` – TypeScript types
- `constants/` – App constants
- `i18n/` – Translations (en, nl, etc.)

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator/device |
| `npm run android` | Run on Android emulator/device |
| `npm run web` | Run web version |
| `npm run lint` | Run ESLint |

For build and version scripts, see [BUILD.md](./BUILD.md).

## Supabase (local development)

```bash
supabase start
supabase status   # Get URLs and keys
supabase db reset # Reset DB and run migrations
```

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
