import { Clock, Users, Wallet, Receipt } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import type { TopUpRequest, UserProfile } from '@/types';

interface AdminStatsProps {
  users: UserProfile[];
  topUps: TopUpRequest[];
}

export default function AdminStats({ users, topUps }: AdminStatsProps) {
  const totalBalances = users.reduce((sum, user) => sum + user.balance, 0);
  const pendingCount = topUps.filter((item) => item.status === 'pending').length;

  const cards = [
    { label: 'إجمالي المستخدمين', value: users.length.toLocaleString('en-US'), icon: Users },
    { label: 'إجمالي الأرصدة', value: formatPrice(totalBalances), icon: Wallet },
    { label: 'طلبات الشحن', value: topUps.length.toLocaleString('en-US'), icon: Receipt },
    { label: 'قيد المراجعة', value: pendingCount.toLocaleString('en-US'), icon: Clock },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-brand-500/40">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
            <card.icon className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold text-zinc-400">{card.label}</span>
          <span dir="ltr" className="text-start text-lg font-extrabold text-zinc-50">{card.value}</span>
        </div>
      ))}
    </div>
  );
}
