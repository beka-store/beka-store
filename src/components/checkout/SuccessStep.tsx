import { CheckCircle2, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/format';

interface SuccessStepProps {
  gameName: string;
  packageLabel: string;
  playerId: string;
  receiptSaved: boolean;
  onClose: () => void;
}

export default function SuccessStep({
  gameName,
  packageLabel,
  playerId,
  receiptSaved,
  onClose,
}: SuccessStepProps) {
  const whatsappUrl = buildWhatsAppUrl(
    `مرحباً، أرسلت طلب شحن ${gameName} - ${packageLabel} للاعب ID: ${playerId}${
      receiptSaved ? '، وهذا إشعار التحويل.' : '، وما قدرت أرفع صورة الإشعار هنا.'
    }`
  );

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/15 text-brand-300 animate-fade-up">
        <CheckCircle2 className="h-9 w-9" />
      </span>
      <div>
        <h2 className="text-xl font-bold text-zinc-50">تم استلام طلبك بنجاح</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          طلبك اتحفظ عندنا، وبنراجع التحويل ونشحن الباقة على حسابك في أقرب وقت.
        </p>
        {!receiptSaved && (
          <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm leading-relaxed text-amber-200">
            ما وصلت صورة الإشعار. ابعتها لينا على واتساب عشان نسرّع التأكيد.
          </p>
        )}
      </div>
      <div className="flex w-full flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-500"
        >
          <MessageCircle className="h-4 w-4" />
          إرسال الإشعار على واتساب
        </a>
        <button
          type="button"
          onClick={onClose}
          className="h-12 rounded-xl border border-zinc-700 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          العودة إلى الألعاب
        </button>
      </div>
    </div>
  );
}
