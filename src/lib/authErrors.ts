const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-phone-number': 'رقم الهاتف غير صحيح، تأكد من كتابته.',
  'auth/missing-phone-number': 'أدخل رقم الهاتف أولاً.',
  'auth/too-many-requests': 'تم إرسال طلبات كثيرة، حاول لاحقاً.',
  'auth/invalid-verification-code': 'رمز التحقق غير صحيح.',
  'auth/code-expired': 'انتهت صلاحية الرمز، اطلب رمزاً جديداً.',
  'auth/quota-exceeded': 'تم تجاوز حد الرسائل اليومي، حاول لاحقاً.',
  'auth/network-request-failed': 'تعذر الاتصال بالإنترنت، تأكد من الاتصال وحاول مرة أخرى.',
  'auth/operation-not-allowed': 'طريقة تسجيل الدخول هذه غير مفعلة بعد.',
  'auth/unauthorized-domain': 'هذا الموقع غير مصرح له بتسجيل الدخول بعد.',
  'auth/captcha-check-failed': 'فشل التحقق الأمني، حاول مرة أخرى.',
};

export function describeAuthError(err: unknown): string {
  const code = (err as { code?: string }).code ?? '';
  return AUTH_ERROR_MESSAGES[code] ?? 'تعذر إكمال العملية، حاول مرة أخرى.';
}
