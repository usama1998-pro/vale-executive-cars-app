/**
 * Expo app config. API URL is read from `.env` into `extra` (single source for the app).
 */
const path = require('node:path');
const { readEnvFile } = require('./scripts/load-env-file.cjs');
const { withPlugins } = require('@expo/config-plugins');
const withAndroidNetworkSecurity = require('./plugins/withAndroidNetworkSecurity.cjs');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const fileEnv = readEnvFile(__dirname);

function resolveApiBaseUrl() {
  const raw =
    process.env.BASE_API_URL ?? fileEnv.BASE_API_URL ?? 'http://localhost:3001';
  return String(raw).trim().replace(/\/$/, '');
}

const apiBaseUrl = resolveApiBaseUrl();

if (process.env.NODE_ENV !== 'test') {
  console.log('[app.config] API base URL →', apiBaseUrl);
}

module.exports = ({ config }) =>
  withPlugins(
    {
      ...config,
      extra: {
        ...(config.extra ?? {}),
        BASE_API_URL: apiBaseUrl,
      },
    },
    [withAndroidNetworkSecurity],
  );
