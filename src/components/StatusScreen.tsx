import { Loader2 } from 'lucide-react';

interface StatusScreenProps {
  title: string;
  description?: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export default function StatusScreen({
  title,
  description,
  loading = false,
  actionLabel,
  onAction,
}: StatusScreenProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      {loading && <Loader2 className="h-8 w-8 animate-spin text-brand-400" />}
      <h1 className="text-xl font-bold text-zinc-50">{title}</h1>
      {description && <p className="max-w-sm text-sm text-zinc-400">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-500 active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
