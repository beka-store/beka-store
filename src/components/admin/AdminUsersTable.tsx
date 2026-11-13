import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import type { UserProfile } from '@/types';

interface AdminUsersTableProps {
  users: UserProfile[];
}

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...users]
      .filter(
        (user) =>
          !term ||
          (user.name ?? '').toLowerCase().includes(term) ||
          (user.email ?? '').toLowerCase().includes(term) ||
          (user.phone ?? '').includes(term)
      )
      .sort((a, b) => b.balance - a.balance);
  }, [users, query]);

  return (
    <div className="flex flex-col gap-4">
      <label className="relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث بالاسم أو البريد أو الهاتف"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 ps-11 pe-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
      </label>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-sm text-zinc-400">
          لا يوجد مستخدمون مطابقون
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full min-w-[600px] text-start text-sm">
            <thead className="bg-zinc-900 text-xs text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">الاسم</th>
                <th className="px-4 py-3 font-semibold">البريد الإلكتروني</th>
                <th className="px-4 py-3 font-semibold">الهاتف</th>
                <th className="px-4 py-3 font-semibold">الرصيد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {visible.map((user) => (
                <tr key={user.uid} className="transition-colors hover:bg-zinc-900/60">
                  <td className="px-4 py-3 font-semibold text-zinc-100">{user.name ?? '—'}</td>
                  <td dir="ltr" className="px-4 py-3 text-zinc-300">{user.email ?? '—'}</td>
                  <td dir="ltr" className="px-4 py-3 text-zinc-300">{user.phone ?? '—'}</td>
                  <td dir="ltr" className="px-4 py-3 font-bold text-brand-300">{formatPrice(user.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
