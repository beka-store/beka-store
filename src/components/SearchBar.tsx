import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ابحث عن لعبتك..."
        aria-label="ابحث عن لعبة"
        className="h-14 w-full rounded-2xl border border-zinc-700 bg-zinc-900/80 ps-12 pe-12 text-base text-zinc-50 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="مسح البحث"
          className="absolute end-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
