export function normalizeLocalPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  let local: string;
  if (digits.startsWith('249') && digits.length === 12) local = `0${digits.slice(3)}`;
  else if (digits.length === 10 && digits.startsWith('0')) local = digits;
  else if (digits.length === 9) local = `0${digits}`;
  else return null;
  return /^0\d{9}$/.test(local) ? local : null;
}

export function toE164(local: string): string {
  return `+249${local.slice(1)}`;
}

export function fromE164(e164: string): string | null {
  return normalizeLocalPhone(e164);
}
