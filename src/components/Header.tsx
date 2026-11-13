import { UserRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ACCOUNT_ROUTE, STORE_NAME } from '@/lib/config';

export default function Header() {
  const { firebaseUser, profile } = useAuth();
  const firstName = profile?.name?.trim().split(/\s+/)[0];
  const accountLabel = firebaseUser ? (firstName ?? 'حسابي') : 'تسجيل الدخول';

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#/" className="group flex items-center gap-3">
          <img
            src="/IMG_20261112_165719.jpg"
            alt={STORE_NAME}
            className="h-11 w-11 rounded-xl object-cover ring-1 ring-brand-500/40 shadow-lg shadow-brand-600/30 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-base font-bold text-zinc-50 sm:text-lg">{STORE_NAME}</span>
        </a>
        <a
          href={`#${ACCOUNT_ROUTE}`}
          aria-label="حسابي"
          className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 px-3 text-sm font-semibold text-zinc-200 transition-colors duration-200 hover:border-brand-500 hover:text-brand-300"
        >
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="" className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <UserRound className="h-5 w-5" />
          )}
          <span className="max-w-[7rem] truncate">{accountLabel}</span>
        </a>
      </div>
    </header>
  );
}
