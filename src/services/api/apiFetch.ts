import { Platform } from 'react-native';
import { API_BASE_URL } from '../../constants/config';
import { ApiRequestError, readResponseErrorMessage } from '../../lib/apiErrors';

const REQUEST_TIMEOUT_MS = 30_000;

type FetchOptions = {
  method?: string;
  body?: unknown;
};

function buildUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

/**
 * Build fetch init without `body: undefined` — that breaks GET on React Native Android
 * (web/Postman are unaffected, which is why only mobile failed).
 */
function buildApiHeaders(body: unknown | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  // Required for ngrok free tier (skip browser interstitial)
  if (API_BASE_URL.includes('ngrok')) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

function buildFetchInit(
  method: string,
  body: unknown | undefined,
  signal: AbortSignal,
): RequestInit {
  const headers = buildApiHeaders(body);
  const init: RequestInit = { method, headers, signal };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  return init;
}

/** Hint when ngrok upstream is misconfigured (common: tunnel → :3000, API runs on :3001). */
function formatNgrokUpstreamHint(message: string): string {
  if (!message.includes('ngrok') && !message.includes('ERR_NGROK')) {
    return message;
  }
  if (message.includes('localhost:3000')) {
    return (
      `${message}\n\n` +
      'Your ngrok tunnel points to port 3000, but this API listens on 3001. ' +
      'Stop ngrok and run: ngrok http 3001 (with the backend running: npm run start:dev).'
    );
  }
  return message;
}

function networkFailureHint(): string {
  if (Platform.OS === 'web') {
    return '';
  }
  return ' (Native app: run npx expo run:android after updating, or check SSL on the API host.)';
}

async function apiRequest(path: string, options: FetchOptions = {}): Promise<Response> {
  const { method = 'GET', body } = options;
  const url = buildUrl(path);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, buildFetchInit(method, body, controller.signal));

    if (!res.ok) {
      const msg = formatNgrokUpstreamHint(await readResponseErrorMessage(res));
      throw new ApiRequestError(msg, res.status, path, url);
    }

    return res;
  } catch (e) {
    if (e instanceof ApiRequestError) {
      throw e;
    }

    const raw = e instanceof Error ? e.message : String(e);
    const isAbort =
      e instanceof Error &&
      (e.name === 'AbortError' || raw.toLowerCase().includes('aborted'));

    if (__DEV__) {
      console.warn('[api] request failed:', method, url, raw);
    }

    const message = isAbort
      ? `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
      : raw || 'Network request failed';

    throw new ApiRequestError(
      Platform.OS === 'web' ? message : `${message}${networkFailureHint()}`,
      0,
      path,
      url,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiGetJson<T>(path: string): Promise<T> {
  const res = await apiRequest(path, { method: 'GET' });
  const raw = await res.text();
  if (!raw) {
    return undefined as T;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new ApiRequestError('Server returned an invalid JSON response', 502, path);
  }
}

export async function apiPostJson<T>(path: string, body: unknown): Promise<T> {
  const res = await apiRequest(path, { method: 'POST', body });
  const raw = await res.text();
  if (!raw) {
    return undefined as T;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new ApiRequestError('Server returned an invalid JSON response', 502, path);
  }
}

/** Quick connectivity check (dev / diagnostics). */
export async function pingApiHealth(): Promise<{ ok: boolean; message: string }> {
  try {
    await apiGetJson('/health/db');
    return { ok: true, message: 'API reachable' };
  } catch (e) {
    return {
      ok: false,
      message: formatPingError(e),
    };
  }
}

function formatPingError(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.url ? `${error.message} → ${error.url}` : error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}
