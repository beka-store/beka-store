import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { TOP_UP_METHODS, TOP_UP_STATUS_LABELS, TOP_UP_STATUS_STYLES, formatDateTime } from '@/lib/wallet';
import { subscribeToMyTopUps } from '@/lib/topups';
import { formatPrice } from '@/lib/format';
import type { TopUpRequest } from '@/types';

interface TopUpHistoryProps {
  uid: string;
}

export default function TopUpHistory({ uid }: TopUpHistoryProps) {
  const [items, setItems] = useState<TopUpRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(null);
    setError(null);
    return subscribeToMyTopUps(
      uid,
      setItems,
      () => setError('تعذر تحميل طلبات الشحن، حاول مرة أخرى لاحقاً.')
    );
  }, [uid]);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-zinc-50">طلبات الشحن</h2>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {!error && items === null && <p className="text-sm text-zinc-500">جاري تحميل الطلبات...</p>}

      {items && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-700 p-8 text-center text-sm text-zinc-400">
          لا توجد طلبات شحن بعد
        </div>
      )}

      {items && items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {items.map((item) => {
            const method = TOP_UP_METHODS.find((entry) => entry.id === item.method);
            return (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span dir="ltr" className="text-base font-bold text-zinc-50">{formatPrice(item.amount)}</span>
                  <span className="text-xs text-zinc-400">
                    {method?.label ?? item.method} · رقم العملية {item.transactionNumber}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${TOP_UP_STATUS_STYLES[item.status]}`}>
                  {TOP_UP_STATUS_LABELS[item.status]}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
