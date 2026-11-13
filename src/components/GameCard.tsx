import { CreditCard, Gamepad2, ChevronLeft } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { navigateTo } from '@/hooks/useHashRoute';
import type { Game } from '@/types';

interface GameCardProps {
  game: Game;
  packageCount: number;
  startingPrice: number | null;
}

export default function GameCard({ game, packageCount, startingPrice }: GameCardProps) {
  return (
    <button
      type="button"
      onClick={() => navigateTo(`/game/${game.id}`)}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-start transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-xl hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
    >
      <div
        className="pointer-events-none absolute -top-12 -end-12 h-32 w-32 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-50"
        style={{ backgroundColor: game.accent_color }}
      />
      <div className="relative flex items-start justify-between">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-xl text-zinc-950 transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: game.accent_color }}
        >
          {game.id === 'us-visa' ? (
            <CreditCard className="h-7 w-7" strokeWidth={2.2} />
          ) : (
            <Gamepad2 className="h-7 w-7" strokeWidth={2.2} />
          )}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white">
          <ChevronLeft className="h-4 w-4" />
        </span>
      </div>
      <div className="relative mt-6">
        <h3 className="text-lg font-bold text-zinc-50">{game.name_ar}</h3>
        <p className="mt-0.5 text-sm text-zinc-400">{game.name_en}</p>
      </div>
      <div className="relative mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-sm">
        <span className="text-zinc-400">{packageCount} باقات</span>
        {startingPrice !== null && (
          <span className="font-semibold text-brand-300">من {formatPrice(startingPrice)}</span>
        )}
      </div>
    </button>
  );
}
