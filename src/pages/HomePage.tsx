import { useMemo, useState } from 'react';
import GameCard from '@/components/GameCard';
import SearchBar from '@/components/SearchBar';
import WalletSection from '@/components/wallet/WalletSection';
import { STORE_NAME } from '@/lib/config';
import type { Game, Package } from '@/types';

interface HomePageProps {
  games: Game[];
  packages: Package[];
}

const HERO_IMAGE_URL =
  'https://images.pexels.com/photos/20519465/pexels-photo-20519465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function HomePage({ games, packages }: HomePageProps) {
  const [query, setQuery] = useState('');

  const visibleGames = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return games;
    return games.filter(
      (game) =>
        game.name_ar.includes(term) || game.name_en.toLowerCase().includes(term)
    );
  }, [games, query]);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-800">
        <img
          src={HERO_IMAGE_URL}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/70 to-zinc-950" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 sm:py-20">
          <img
            src="/IMG_20261112_165719.jpg"
            alt={STORE_NAME}
            className="h-36 w-36 rounded-3xl object-cover shadow-2xl shadow-brand-600/40 ring-1 ring-brand-500/40 animate-fade-up sm:h-48 sm:w-48"
          />
          <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1.5 text-xs font-bold text-brand-300">
            شحن سريع وآمن
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-zinc-50 sm:text-5xl">
            اشحن ألعابك المفضلة
            <span className="block bg-gradient-to-l from-brand-300 to-electric-400 bg-clip-text text-transparent">في دقائق</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            اختر لعبتك، والباقة التي تناسبك، وادفع بالطريقة الأسهل لك.
          </p>
          <div className="w-full pt-2">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </div>
      </section>

      <div id="wallet">
        <WalletSection />
      </div>

      <section id="games" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-bold text-zinc-50 sm:text-2xl">الألعاب</h2>
          <span className="text-sm text-zinc-500">{visibleGames.length} لعبة</span>
        </div>

        {visibleGames.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
            لا توجد لعبة تطابق بحثك
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGames.map((game) => {
              const gamePackages = packages.filter((pkg) => pkg.game_id === game.id);
              const prices = gamePackages.map((pkg) => pkg.price_sdg);
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  packageCount={gamePackages.length}
                  startingPrice={prices.length ? Math.min(...prices) : null}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
