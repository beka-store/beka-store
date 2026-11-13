import { ChevronLeft, Coins } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import type { Package } from '@/types';

interface PackageCardProps {
  pkg: Package;
  accentColor: string;
  onSelect: (pkg: Package) => void;
}

export default function PackageCard({ pkg, accentColor, onSelect }: PackageCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pkg)}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-start transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/60 hover:shadow-lg hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
    >
      <div className="flex items-center gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-zinc-950"
          style={{ backgroundColor: accentColor }}
        >
          <Coins className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <div>
          <p className="text-base font-bold text-zinc-50">{pkg.label_ar}</p>
          <p className="mt-0.5 text-sm font-semibold text-brand-300">{formatPrice(pkg.price_sdg)}</p>
        </div>
      </div>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white">
        <ChevronLeft className="h-4 w-4" />
      </span>
    </button>
  );
}
