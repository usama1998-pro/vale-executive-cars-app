const fs = require('node:fs');
const path = require('node:path');

/**
 * Parse a .env file without depending on dotenv (works when Hostinger/dotenvx inject 0 vars).
 */
function readEnvFile(dir) {
  const envPath = path.join(dir, '.env');
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const text = fs.readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
  const out = {};

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq <= 0) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }

  return out;
}

module.exports = { readEnvFile };
