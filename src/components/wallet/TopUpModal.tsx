import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, X } from 'lucide-react';
import ReceiptUpload from '@/components/checkout/ReceiptUpload';
import { buildWhatsAppUrl, formatPrice } from '@/lib/format';
import {
  MAX_SCREENSHOT_DATA_URL_LENGTH,
  TOP_UP_METHODS,
  readImageAsCompressedDataUrl,
} from '@/lib/wallet';
import { createTopUp } from '@/lib/topups';
import type { TopUpMethodId, UserProfile } from '@/types';

const MAX_AMOUNT = 1_000_000;

interface TopUpModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export default function TopUpModal({ profile, onClose }: TopUpModalProps) {
  const [method, setMethod] = useState<TopUpMethodId>('faisal');
  const [amountInput, setAmountInput] = useState('');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ amount?: string; transaction?: string; screenshot?: string; submit?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAmount, setSubmittedAmount] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, isSubmitting]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!profile.name || !profile.phone) return;

    const amount = Number(amountInput);
    const nextErrors: typeof errors = {};
    if (!Number.isInteger(amount) || amount < 1 || amount > MAX_AMOUNT) {
      nextErrors.amount = `أدخل مبلغاً صحيحاً بين 1 و ${MAX_AMOUNT.toLocaleString('en-US')} ج.س`;
    }
    const trimmedTransaction = transactionNumber.trim();
    if (trimmedTransaction.length < 3 || trimmedTransaction.length > 60) {
      nextErrors.transaction = 'أدخل رقم العملية كما يظهر في إشعار التحويل';
    }
    if (!screenshot) nextErrors.screenshot = 'ارفع صورة إشعار التحويل';
    if (Object.keys(nextErrors).length > 0 || !screenshot) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      const dataUrl = await readImageAsCompressedDataUrl(screenshot);
      if (dataUrl.length > MAX_SCREENSHOT_DATA_URL_LENGTH) {
        setErrors({ screenshot: 'الصورة كبيرة جداً، اختر صورة أصغر' });
        return;
      }
      await createTopUp({
        user: { uid: profile.uid, name: profile.name, phone: profile.phone, email: profile.email },
        amount,
        method,
        transactionNumber: trimmedTransaction,
        screenshot: dataUrl,
      });
      setSubmittedAmount(amount);
    } catch {
      setErrors({ submit: 'تعذر إرسال الطلب، تأكد من الاتصال وحاول مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="إغلاق"
        onClick={() => !isSubmitting && onClose()}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="اشحن محفظتك"
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-zinc-800 bg-zinc-900 shadow-2xl animate-fade-up sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold text-zinc-400">BEKO WALLET</p>
            <p className="mt-1 text-base font-bold text-zinc-50">اشحن محفظتك</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="إغلاق"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          {submittedAmount === null ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-sm font-semibold text-zinc-200">طريقة التحويل</legend>
                {TOP_UP_METHODS.map((item) => {
                  const isSelected = method === item.id;
                  return (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-600/10'
                          : 'border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="topup-method"
                          value={item.id}
                          checked={isSelected}
                          onChange={() => setMethod(item.id)}
                          className="h-4 w-4 accent-brand-500"
                        />
                        <span className="text-sm font-bold text-zinc-100">{item.label}</span>
                      </span>
                      {item.accountNumber && (
                        <span dir="ltr" className="text-sm font-semibold tracking-wider text-brand-300">
                          {item.accountNumber}
                        </span>
                      )}
                    </label>
                  );
                })}
              </fieldset>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-zinc-200">المبلغ (ج.س)</span>
                <input
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="500"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                />
                {errors.amount && <span className="text-sm text-red-400">{errors.amount}</span>}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-zinc-200">رقم العملية</span>
                <input
                  value={transactionNumber}
                  onChange={(event) => setTransactionNumber(event.target.value)}
                  dir="ltr"
                  placeholder="TXN123456"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                />
                {errors.transaction && <span className="text-sm text-red-400">{errors.transaction}</span>}
              </label>

              <ReceiptUpload
                file={screenshot}
                error={errors.screenshot ?? null}
                onChange={setScreenshot}
              />

              {errors.submit && <p className="text-sm text-red-400">{errors.submit}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                إرسال طلب الشحن
              </button>
            </form>
          ) : (
            <TopUpSuccess
              name={profile.name ?? ''}
              amount={submittedAmount}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TopUpSuccess({ name, amount, onClose }: { name: string; amount: number; onClose: () => void }) {
  const message = `طلب شحن جديد من ${name} بمبلغ ${formatPrice(amount)}`;
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center animate-fade-up">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
        <CheckCircle2 className="h-9 w-9" />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-zinc-50">تم استلام طلبك</h3>
        <p className="text-sm leading-relaxed text-zinc-400">
          طلبك الآن قيد المراجعة، وسيُضاف المبلغ إلى رصيدك بعد التأكد من التحويل. أرسل الطلب إلينا عبر واتساب لتسريع المراجعة.
        </p>
      </div>
      <a
        href={buildWhatsAppUrl(message)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30"
      >
        أرسل الطلب عبر واتساب
      </a>
      <button
        type="button"
        onClick={onClose}
        className="text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
      >
        إغلاق
      </button>
    </div>
  );
}
