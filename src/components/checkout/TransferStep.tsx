import { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, Check, Copy, Loader2 } from 'lucide-react';
import ReceiptUpload from '@/components/checkout/ReceiptUpload';
import { validateReceipt } from '@/lib/orders';
import type { PaymentMethod } from '@/types';

interface TransferStepProps {
  method: PaymentMethod;
  amountLabel: string;
  isSubmitting: boolean;
  submitError: string | null;
  onBack: () => void;
  onSubmit: (receipt: File) => void;
}

export default function TransferStep({
  method,
  amountLabel,
  isSubmitting,
  submitError,
  onBack,
  onSubmit,
}: TransferStepProps) {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(method.account_value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function handleReceiptChange(file: File | null) {
    setReceiptError(null);
    if (!file) {
      setReceipt(null);
      return;
    }
    const error = validateReceipt(file);
    if (error) {
      setReceipt(null);
      setReceiptError(error);
      return;
    }
    setReceipt(file);
  }

  function handleConfirm() {
    if (!receipt) {
      setReceiptError('ارفع صورة إشعار التحويل أولاً');
      return;
    }
    onSubmit(receipt);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-50">أكمل الدفع عبر {method.name_ar}</h2>
        <p className="mt-1 text-sm text-zinc-400">حوّل المبلغ ثم ارفع صورة الإشعار</p>
      </div>

      <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-600/20 to-zinc-950 p-5">
        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span>المبلغ المطلوب</span>
          <span className="font-bold text-brand-300">{amountLabel}</span>
        </div>
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <p className="text-xs font-semibold text-zinc-400">{method.account_label_ar}</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p dir="ltr" className="break-all text-lg font-bold tracking-wide text-zinc-50">
              {method.account_value}
            </p>
            <button
              type="button"
              onClick={copyAccount}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-brand-500 hover:text-brand-300"
            >
              {copied ? <Check className="h-4 w-4 text-brand-300" /> : <Copy className="h-4 w-4" />}
              {copied ? 'تم النسخ' : 'نسخ'}
            </button>
          </div>
        </div>
        {method.instructions_ar && (
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{method.instructions_ar}</p>
        )}
      </div>

      <ReceiptUpload file={receipt} error={receiptError} onChange={handleReceiptChange} />

      {submitError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800 disabled:opacity-40"
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-500 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            'تم التحويل'
          )}
        </button>
      </div>
    </div>
  );
}
