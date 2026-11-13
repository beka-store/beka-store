import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import TopUpModal from '@/components/wallet/TopUpModal';
import { formatPrice } from '@/lib/format';
import type { UserProfile } from '@/types';

interface WalletCardProps {
  profile: UserProfile;
}

export default function WalletCard({ profile }: WalletCardProps) {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-700 via-brand-600 to-electric-600 p-6 text-white shadow-2xl shadow-brand-700/30 animate-fade-up sm:p-8">
      <div className="pointer-events-none absolute -end-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
            <Wallet className="h-4 w-4" />
            رصيد محفظتك
          </span>
          <p dir="ltr" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {formatPrice(profile.balance)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsTopUpOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 active:translate-y-0"
        >
          <Plus className="h-4 w-4" />
          اشحن محفظتي
        </button>
      </div>
      {isTopUpOpen && <TopUpModal profile={profile} onClose={() => setIsTopUpOpen(false)} />}
    </section>
  );
}
