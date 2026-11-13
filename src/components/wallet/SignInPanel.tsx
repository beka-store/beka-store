import { useState } from 'react';
import { Loader2, Smartphone, Wallet } from 'lucide-react';
import PhoneSignIn from '@/components/wallet/PhoneSignIn';
import { useAuth } from '@/hooks/useAuth';

export default function SignInPanel() {
  const { signInWithGoogle } = useAuth();
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [isGoogleBusy, setIsGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null);
    setIsGoogleBusy(true);
    try {
      await signInWithGoogle();
    } catch {
      setError('تعذر تسجيل الدخول بحساب قوقل، حاول مرة أخرى.');
    } finally {
      setIsGoogleBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-fade-up sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
            <Wallet className="h-7 w-7" />
          </span>
          <h1 className="text-xl font-bold text-zinc-50 sm:text-2xl">مرحباً بك في BEKO WALLET</h1>
          <p className="text-sm leading-relaxed text-zinc-400">سجل دخولك لعرض رصيدك وشحن محفظتك بسهولة.</p>
        </div>

        {isPhoneMode ? (
          <PhoneSignIn onBack={() => setIsPhoneMode(false)} />
        ) : (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={isGoogleBusy}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleMark />}
              سجل دخول بحساب قوقل
            </button>
            <button
              type="button"
              onClick={() => setIsPhoneMode(true)}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-bold text-zinc-100 transition-colors duration-200 hover:border-brand-500 hover:bg-brand-500/10"
            >
              <Smartphone className="h-5 w-5 text-brand-300" />
              سجل دخول برقم الهاتف
            </button>
            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z" />
      <path fill="#34A853" d="M3.7 7.4l3.2 2.3C7.8 7.7 9.7 6.3 12 6.3c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5c-3.7 0-6.9 2.1-8.3 4.9z" />
      <path fill="#FBBC05" d="M12 21.5c2.5 0 4.6-.8 6.1-2.3l-2.8-2.3c-.8.5-1.8.9-3.3.9-3.9 0-5.3-2.6-5.5-3.9l-3.2 2.5c1.4 2.8 4.5 5.1 8.7 5.1z" />
      <path fill="#4285F4" d="M21.1 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.3 1.3-1 2.3-2.1 3.1l2.8 2.3c1.6-1.5 2.9-3.9 2.9-7.7z" />
    </svg>
  );
}
