export class ApiRequestError extends Error {
  override readonly name = 'ApiRequestError';

  constructor(
    message: string,
    public readonly status: number,
    public readonly path?: string,
    public readonly url?: string,
  ) {
    super(message);
  }
}

export async function readResponseErrorMessage(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as {
      success?: boolean;
      message?: unknown;
    };
    if (j.success === false && typeof j.message === 'string') {
      return j.message;
    }
    if (Array.isArray(j.message)) {
      return j.message.map(String).join('\n');
    }
    if (typeof j.message === 'string') {
      return j.message;
    }
  } catch {
    // ignore
  }
  return text || res.statusText || `Request failed (${res.status})`;
}

export function formatApiErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 0) {
      const detail = error.message.trim();
      if (detail && !detail.toLowerCase().includes('base_api_url')) {
        return `Could not reach the server.\n\n${detail}`;
      }
      return 'Could not reach the server. Check your internet connection and try again.';
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
