import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { describeAuthError } from '@/lib/authErrors';
import { getFirebase, isFirebaseConfigured } from '@/lib/firebase';
import { normalizeLocalPhone, toE164 } from '@/lib/phone';

const RECAPTCHA_CONTAINER_ID = 'beko-recaptcha';

interface PhoneSignInProps {
  onBack: () => void;
}

export default function PhoneSignIn({ onBack }: PhoneSignInProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      verifierRef.current?.clear();
      verifierRef.current = null;
    };
  }, []);

  function getVerifier(): RecaptchaVerifier {
    if (!verifierRef.current) {
      const { auth } = getFirebase();
      verifierRef.current = new RecaptchaVerifier(auth, RECAPTCHA_CONTAINER_ID, { size: 'invisible' });
    }
    return verifierRef.current;
  }

  async function handleSendCode(event: FormEvent) {
    event.preventDefault();
    if (!isFirebaseConfigured) return;
    const local = normalizeLocalPhone(phone);
    if (!local) {
      setError('أدخل رقم هاتف سوداني صحيح، مثال: 0912345678');
      return;
    }
    setIsBusy(true);
    setError(null);
    try {
      const { auth } = getFirebase();
      setConfirmation(await signInWithPhoneNumber(auth, toE164(local), getVerifier()));
    } catch (err) {
      verifierRef.current?.clear();
      verifierRef.current = null;
      setError(describeAuthError(err));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleVerifyCode(event: FormEvent) {
    event.preventDefault();
    if (!confirmation) return;
    setIsBusy(true);
    setError(null);
    try {
      await confirmation.confirm(code.trim());
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setIsBusy(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30';

  return (
    <div className="flex flex-col gap-4">
      <div id={RECAPTCHA_CONTAINER_ID} />

      {confirmation ? (
        <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-200">أدخل رمز التحقق المرسل إلى هاتفك</span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              inputMode="numeric"
              dir="ltr"
              autoComplete="one-time-code"
              placeholder="123456"
              className={`${inputClass} text-center tracking-[0.4em]`}
            />
          </label>
          <button
            type="submit"
            disabled={isBusy || code.trim().length < 6}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
            تأكيد الدخول
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
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
          <button
            type="submit"
            disabled={isBusy || !phone.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
            أرسل رمز التحقق
          </button>
        </form>
      )}

      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
      >
        <ArrowRight className="h-4 w-4" />
        رجوع إلى الخيارات
      </button>
    </div>
  );
}
