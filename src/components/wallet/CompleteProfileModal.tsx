import { useState, type FormEvent } from 'react';
import { Loader2, UserRound } from 'lucide-react';
import { updateProfileDetails } from '@/lib/profiles';
import { normalizeLocalPhone } from '@/lib/phone';
import type { UserProfile } from '@/types';

interface CompleteProfileModalProps {
  profile: UserProfile;
}

export default function CompleteProfileModal({ profile }: CompleteProfileModalProps) {
  const needsName = !profile.name?.trim();
  const needsPhone = !profile.phone;
  const [name, setName] = useState(profile.name ?? '');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (needsName && trimmedName.length < 2) {
      setError('أدخل اسمك الكامل.');
      return;
    }
    const localPhone = needsPhone ? normalizeLocalPhone(phone) : profile.phone;
    if (!localPhone) {
      setError('أدخل رقم هاتف سوداني صحيح، مثال: 0912345678');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateProfileDetails(profile.uid, {
        name: needsName ? trimmedName : (profile.name ?? trimmedName),
        phone: localPhone,
      });
    } catch {
      setError('تعذر حفظ البيانات، تأكد من الاتصال وحاول مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="إكمال بيانات الحساب"
        className="relative w-full rounded-t-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-fade-up sm:max-w-md sm:rounded-3xl sm:p-8"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
            <UserRound className="h-7 w-7" />
          </span>
          <h2 className="text-lg font-bold text-zinc-50">أكمل بيانات حسابك</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            نحتاج هذه البيانات مرة واحدة فقط لتفعيل محفظتك وربط طلبات الشحن بحسابك.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {needsName && (
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-zinc-200">الاسم الكامل</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className={inputClass}
              />
            </label>
          )}
          {needsPhone && (
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-zinc-200">رقم الهاتف</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                inputMode="tel"
                dir="ltr"
                autoComplete="tel-national"
                placeholder="0912345678"
                className={inputClass}
              />
            </label>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            حفظ والمتابعة
          </button>
        </form>
      </div>
    </div>
  );
}
