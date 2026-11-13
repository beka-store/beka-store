import { useState, type FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  isValidPlayerId,
  isValidWhatsapp,
  normalizePlayerId,
  normalizeWhatsapp,
} from '@/lib/orders';

interface PlayerInfo {
  playerId: string;
  whatsapp: string;
}

interface PlayerDetailsStepProps {
  initial: PlayerInfo | null;
  onNext: (info: PlayerInfo) => void;
}

const INPUT_CLASS =
  'h-12 w-full rounded-xl border bg-zinc-950 px-4 text-base text-zinc-50 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:ring-4 focus:ring-brand-500/20';

export default function PlayerDetailsStep({ initial, onNext }: PlayerDetailsStepProps) {
  const [playerId, setPlayerId] = useState(initial?.playerId ?? '');
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? '');
  const [errors, setErrors] = useState<{ playerId?: string; whatsapp?: string }>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedId = normalizePlayerId(playerId);
    const normalizedPhone = normalizeWhatsapp(whatsapp);

    const nextErrors: typeof errors = {};
    if (!isValidPlayerId(normalizedId)) {
      nextErrors.playerId = 'أدخل ID اللاعب (من 3 إلى 50 حرفاً أو رقماً)';
    }
    if (!isValidWhatsapp(normalizedPhone)) {
      nextErrors.whatsapp = 'أدخل رقم واتساب صحيح مع كود الدولة، مثال: 249912345678';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onNext({ playerId: normalizedId, whatsapp: normalizedPhone });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-50">بيانات الحساب</h2>
        <p className="mt-1 text-sm text-zinc-400">ادخل ID اللاعب ورقم واتساب للتواصل معك</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="player-id" className="text-sm font-semibold text-zinc-200">
          ID اللاعب
        </label>
        <input
          id="player-id"
          type="text"
          inputMode="numeric"
          value={playerId}
          onChange={(event) => setPlayerId(event.target.value)}
          placeholder="مثال: 5123456789"
          aria-invalid={Boolean(errors.playerId)}
          className={`${INPUT_CLASS} ${
            errors.playerId ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-brand-500'
          }`}
        />
        {errors.playerId && <p className="text-sm text-red-400">{errors.playerId}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="whatsapp" className="text-sm font-semibold text-zinc-200">
          رقم الواتساب
        </label>
        <input
          id="whatsapp"
          type="tel"
          dir="ltr"
          inputMode="tel"
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
          placeholder="249912345678"
          aria-invalid={Boolean(errors.whatsapp)}
          className={`${INPUT_CLASS} text-start ${
            errors.whatsapp ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-brand-500'
          }`}
        />
        {errors.whatsapp && <p className="text-sm text-red-400">{errors.whatsapp}</p>}
      </div>

      <button
        type="submit"
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-500 active:scale-[0.99]"
      >
        متابعة
        <ArrowLeft className="h-4 w-4" />
      </button>
    </form>
  );
}
