import { ChevronLeft, Wallet } from 'lucide-react';
import WalletCard from '@/components/wallet/WalletCard';
import { useAuth } from '@/hooks/useAuth';
import { ACCOUNT_ROUTE } from '@/lib/config';

export default function WalletSection() {
  const { firebaseUser, profile, isLoading } = useAuth();

  if (isLoading) return null;

  if (firebaseUser && profile) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <WalletCard profile={profile} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <a
        href={`#${ACCOUNT_ROUTE}`}
        className="group flex items-center justify-between gap-4 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5 transition-all duration-200 hover:border-brand-500 hover:bg-brand-500/10"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Wallet className="h-5 w-5" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-bold text-zinc-50">BEKO WALLET</span>
            <span className="text-xs text-zinc-400">سجل دخولك لعرض رصيدك وشحن محفظتك</span>
          </span>
        </span>
        <ChevronLeft className="h-5 w-5 text-brand-300 transition-transform duration-200 group-hover:-translate-x-1" />
      </a>
    </div>
  );
}
