import type { TopUpMethodId, TopUpStatus } from '@/types';

export interface TopUpMethod {
  id: TopUpMethodId;
  label: string;
  accountNumber: string | null;
}

export const TOP_UP_METHODS: TopUpMethod[] = [
  { id: 'fawry', label: 'فوري', accountNumber: null },
  { id: 'faisal', label: 'بنك فيصل', accountNumber: '52113932' },
  { id: 'mycashi', label: 'ماي كاشي', accountNumber: '400294324' },
];

export const TOP_UP_STATUS_LABELS: Record<TopUpStatus, string> = {
  pending: 'قيد المراجعة',
  approved: 'تمت الموافقة',
  rejected: 'مرفوض',
};

export const TOP_UP_STATUS_STYLES: Record<TopUpStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  approved: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-300 ring-red-500/30',
};

const MAX_IMAGE_SIDE = 1280;
export const MAX_SCREENSHOT_DATA_URL_LENGTH = 900_000;

export function getTopUpMethod(id: TopUpMethodId): TopUpMethod {
  const method = TOP_UP_METHODS.find((item) => item.id === id);
  if (!method) throw new Error('Unknown top-up method');
  return method;
}

export function readImageAsCompressedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error('canvas'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      URL.revokeObjectURL(url);
      resolve(dataUrl);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image'));
    };
    image.src = url;
  });
}

const dateFormatter = new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' });

export function formatDateTime(date: Date | null): string {
  return date ? dateFormatter.format(date) : '—';
}
