/** Standard success envelope from the Nest API. */
export type ApiSuccessEnvelope<T> = {
  success: true;
  message: string;
  data: T;
};

/** Standard error envelope from the Nest API. */
export type ApiErrorEnvelope = {
  success: false;
  message: string;
  statusCode: number;
  error?: string;
};

export function unwrapApiData<T>(body: T | ApiSuccessEnvelope<T>): T {
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    (body as ApiSuccessEnvelope<T>).success === true &&
    'data' in body
  ) {
    return (body as ApiSuccessEnvelope<T>).data;
  }
  return body as T;
}
