import { supabase } from '@/lib/supabase';

export const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;

const RECEIPT_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface OrderInput {
  gameId: string;
  packageId: string;
  playerId: string;
  whatsapp: string;
  paymentMethodId: string;
  receipt: File;
}

export function normalizePlayerId(value: string): string {
  return value.trim();
}

export function normalizeWhatsapp(value: string): string {
  return value.replace(/[\s-]/g, '');
}

export function isValidPlayerId(value: string): boolean {
  return value.length >= 3 && value.length <= 50;
}

export function isValidWhatsapp(value: string): boolean {
  return /^\+?[0-9]{7,15}$/.test(value);
}

export function validateReceipt(file: File): string | null {
  if (!RECEIPT_EXTENSIONS[file.type]) {
    return 'الملف يجب أن يكون صورة بصيغة JPG أو PNG أو WebP';
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    return 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت';
  }
  return null;
}

export interface SubmitOrderResult {
  receiptSaved: boolean;
}

async function uploadReceipt(receipt: File): Promise<string | null> {
  const extension = RECEIPT_EXTENSIONS[receipt.type];
  if (!extension) return null;

  const receiptPath = `${crypto.randomUUID()}.${extension}`;
  try {
    const { error } = await supabase.storage.from('receipts').upload(receiptPath, receipt, {
      contentType: receipt.type,
      upsert: false,
    });
    return error ? null : receiptPath;
  } catch {
    return null;
  }
}

export async function submitOrder(input: OrderInput): Promise<SubmitOrderResult> {
  const receiptPath = await uploadReceipt(input.receipt);

  const { error } = await supabase.from('orders').insert({
    game_id: input.gameId,
    package_id: input.packageId,
    player_id: input.playerId,
    whatsapp: input.whatsapp,
    payment_method_id: input.paymentMethodId,
    receipt_path: receiptPath,
  });
  if (error) throw new Error(error.message);

  return { receiptSaved: receiptPath !== null };
}
