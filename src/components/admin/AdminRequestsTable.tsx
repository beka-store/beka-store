import { useState } from 'react';
import { Check, Eye, Loader2, X } from 'lucide-react';
import ScreenshotDialog from '@/components/admin/ScreenshotDialog';
import { formatPrice } from '@/lib/format';
import { approveTopUp, rejectTopUp } from '@/lib/topups';
import { TOP_UP_METHODS, TOP_UP_STATUS_LABELS, TOP_UP_STATUS_STYLES, formatDateTime } from '@/lib/wallet';
import type { TopUpRequest } from '@/types';

type Filter = 'all' | 'pending';

interface AdminRequestsTableProps {
  items: TopUpRequest[];
}

export default function AdminRequestsTable({ items }: AdminRequestsTableProps) {
  const [filter, setFilter] = useState<Filter>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const visible = filter === 'pending' ? items.filter((item) => item.status === 'pending') : items;

  async function handleReview(item: TopUpRequest, action: 'approve' | 'reject') {
    if (action === 'approve' && !window.confirm(`تأكيد إضافة ${formatPrice(item.amount)} إلى رصيد ${item.name}؟`)) return;
    setBusyId(item.id);
    setActionError(null);
    try {
      if (action === 'approve') await approveTopUp(item);
      else await rejectTopUp(item.id);
    } catch (err) {
      const alreadyReviewed = err instanceof Error && err.message === 'ALREADY_REVIEWED';
      setActionError(alreadyReviewed ? 'تمت مراجعة هذا الطلب مسبقاً.' : 'تعذر تنفيذ العملية، حاول مرة أخرى.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-xl border border-zinc-800 bg-zinc-900 p-1">
          {(['pending', 'all'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                filter === value ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {value === 'pending' ? 'قيد المراجعة' : 'الكل'}
            </button>
          ))}
        </div>
        <span className="text-xs text-zinc-500">{visible.length} طلب</span>
      </div>

      {actionError && <p className="text-sm text-red-400">{actionError}</p>}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-sm text-zinc-400">
          لا توجد طلبات في هذه القائمة
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full min-w-[820px] text-start text-sm">
            <thead className="bg-zinc-900 text-xs text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">العميل</th>
                <th className="px-4 py-3 font-semibold">المبلغ</th>
                <th className="px-4 py-3 font-semibold">الطريقة</th>
                <th className="px-4 py-3 font-semibold">رقم العملية</th>
                <th className="px-4 py-3 font-semibold">الإشعار</th>
                <th className="px-4 py-3 font-semibold">التاريخ</th>
                <th className="px-4 py-3 font-semibold">الحالة</th>
                <th className="px-4 py-3 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {visible.map((item) => {
                const method = TOP_UP_METHODS.find((entry) => entry.id === item.method);
                const isBusy = busyId === item.id;
                return (
                  <tr key={item.id} className="transition-colors hover:bg-zinc-900/60">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-100">{item.name}</p>
                      <p dir="ltr" className="text-xs text-zinc-500">{item.phone}</p>
                    </td>
                    <td dir="ltr" className="px-4 py-3 font-bold text-zinc-50">{formatPrice(item.amount)}</td>
                    <td className="px-4 py-3 text-zinc-300">{method?.label ?? item.method}</td>
                    <td dir="ltr" className="px-4 py-3 text-zinc-300">{item.transactionNumber}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setPreviewSrc(item.screenshot)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-brand-500 hover:text-brand-300"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        عرض
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{formatDateTime(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${TOP_UP_STATUS_STYLES[item.status]}`}>
                        {TOP_UP_STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleReview(item, 'approve')}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                          >
                            {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                            موافقة
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleReview(item, 'reject')}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/60 px-2.5 py-1.5 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" />
                            رفض
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500">تمت المراجعة</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {previewSrc && <ScreenshotDialog src={previewSrc} onClose={() => setPreviewSrc(null)} />}
    </div>
  );
}
