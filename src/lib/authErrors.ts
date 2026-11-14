const GENERIC_AUTH_ERROR = 'حصلت مشكلة في الدخول، جرّب تاني بعد شوية.';

export function describeAuthError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return GENERIC_AUTH_ERROR;
}
