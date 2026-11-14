import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Wallet } from 'lucide-react';

interface PaymentMethodStepProps {
  methods?: any[];
  selectedId: string | null;
  onBack: () => void;
  onNext: (methodId: string) => void;
}

export default function PaymentMethodStep({
  selectedId,
  onBack,
  onNext,
}: PaymentMethodStepProps) {
  // الطرق الجديدة مباشرة وثابتة لضمان الظهور الفوري
  const paymentMethods = [
    { 
      id: 'fawry', 
      name_ar: 'فوري', 
      account_label_ar: 'رقم الحساب', 
      account_value: '0123456789' 
    },
    { 
      id: 'mycash', 
      name_ar: 'ماي كاشي', 
      account_label_ar: 'رقم الحساب', 
      account_value: '0987654321' 
    }
  ];

  const [choice, setChoice] = useState<string | null>(selectedId || paymentMethods[0].id);

  const handleNext = () => {
    if (choice) {
      onNext(choice);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-white">طريقة الدفع</h2>
        <p className="mt-1 text-xs text-zinc-400">اختر الطريقة التي ستتحول بها المبلغ</p>
      </div>

      <div role="radiogroup" aria-label="طرق الدفع" className="flex flex-col gap-3">
        {paymentMethods.map((method) => {
          const isSelected = choice === method.id;
          return (
            <div
              key={method.id}
              onClick={() => setChoice(method.id)}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isSelected ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{method.name_ar}</h3>
                  <p className="text-xs text-zinc-400">{method.account_label_ar}: {method.account_value}</p>
                </div>
              </div>
              <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-zinc-700'}`}>
                {isSelected && <Check className="h-3 w-3 stroke-[3] text-black" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          السابق
        </button>
        <button
          type="button"
          disabled={!choice}
          onClick={handleNext}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
            choice
              ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          متابعة
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
