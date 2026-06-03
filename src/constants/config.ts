import Constants from 'expo-constants';

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/$/, '');
}

const fromExtra = Constants.expoConfig?.extra?.BASE_API_URL;

/**
 * Nest API base URL from `app.config.js` → `expo.extra.BASE_API_URL` (`.env` → BASE_API_URL).
 * Restart Expo after .env changes: npx expo start --clear
 */
export const API_BASE_URL = normalizeBaseUrl(
  typeof fromExtra === 'string' && fromExtra.length > 0
    ? fromExtra
    : __DEV__
      ? 'http://localhost:3001'
      : '',
);

if (__DEV__) {
  console.log('[config] API_BASE_URL =', API_BASE_URL);
  if (typeof fromExtra !== 'string' || fromExtra.length === 0) {
    console.warn('[config] BASE_API_URL missing in expo.extra — using', API_BASE_URL);
  }
}
