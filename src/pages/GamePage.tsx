import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import PackageCard from '@/components/PackageCard';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import { navigateTo } from '@/hooks/useHashRoute';
import type { Game, Package, PaymentMethod } from '@/types';

interface GamePageProps {
  game: Game;
  packages: Package[];
  paymentMethods: PaymentMethod[];
}

export default function GamePage({ game, packages, paymentMethods }: GamePageProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div
          className="pointer-events-none absolute -top-24 start-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: game.accent_color }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="mb-8 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-zinc-300 transition-colors hover:text-brand-300"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الألعاب
          </button>
          <p className="text-sm font-semibold" style={{ color: game.accent_color }}>
            {game.name_en}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-zinc-50 sm:text-5xl">{game.name_ar}</h1>
          <p className="mt-3 text-sm text-zinc-400">اختر الباقة المناسبة لك</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {packages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
            لا توجد باقات متاحة لهذه اللعبة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                accentColor={game.accent_color}
                onSelect={setSelectedPackage}
              />
            ))}
          </div>
        )}
      </section>

      {selectedPackage && (
        <CheckoutModal
          game={game}
          pkg={selectedPackage}
          paymentMethods={paymentMethods}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
}
