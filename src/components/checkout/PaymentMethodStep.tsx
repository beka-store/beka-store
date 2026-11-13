import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Wallet } from 'lucide-react';
import type { PaymentMethod } from '@/types';

interface PaymentMethodStepProps {
  methods: PaymentMethod[];
  selectedId: string | null;
  onBack: () => void;
  onNext: (methodId: string) => void;
}

export default function PaymentMethodStep({ methods, selectedId, onBack, onNext }: PaymentMethodStepProps) {
  const [choice, setChoice] = useState<string | null>(selectedId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-50">طريقة الدفع</h2>
        <p className="mt-1 text-sm text-zinc-400">اختر الطريقة التي ستحول بها المبلغ</p>
      </div>

      {methods.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-700 p-6 text-center text-sm text-zinc-400">
          لا توجد طرق دفع متاحة حالياً
        </p>
      ) : (
        <div role="radiogroup" aria-label="طريقة الدفع" className="flex flex-col gap-3">
          {methods.map((method) => {
            const isSelected = choice === method.id;
            return (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setChoice(method.id)}
                className={`flex items-center justify-between gap-4 rounded-xl border p-4 text-start transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-zinc-700 bg-zinc-950 hover:border-zinc-500'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                  </span>
                  <span className="font-semibold text-zinc-50">{method.name_ar}</span>
                </span>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? 'border-brand-500 bg-brand-600 text-white' : 'border-zinc-600'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </button>
        <button
          type="button"
          disabled={!choice}
          onClick={() => choice && onNext(choice)}
          className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          متابعة
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
