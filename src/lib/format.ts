import { STORE_WHATSAPP_NUMBER } from '@/lib/config';

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('en-US')} ج.س`;
}

export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${STORE_WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
