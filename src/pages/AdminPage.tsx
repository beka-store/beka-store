import { useEffect, useState } from 'react';
import AdminRequestsTable from '@/components/admin/AdminRequestsTable';
import AdminStats from '@/components/admin/AdminStats';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import SignInPanel from '@/components/wallet/SignInPanel';
import StatusScreen from '@/components/StatusScreen';
import { useAuth } from '@/hooks/useAuth';
import { navigateTo } from '@/hooks/useHashRoute';
import { isOwnerProfile } from '@/lib/owner';
import { subscribeToAllTopUps } from '@/lib/topups';
import { subscribeToAllUsers } from '@/lib/profiles';
import type { TopUpRequest, UserProfile } from '@/types';

type Tab = 'requests' | 'users';

const TABS: { id: Tab; label: string }[] = [
  { id: 'requests', label: 'طلبات الشحن' },
  { id: 'users', label: 'المستخدمون' },
];

export default function AdminPage() {
  const { firebaseUser, profile, isLoading } = useAuth();

  if (isLoading) return <StatusScreen title="جاري التحقق من الصلاحيات..." loading />;
  if (!firebaseUser) return <SignInPanel />;
  if (!isOwnerProfile(profile)) {
    return (
      <StatusScreen
        title="هذه الصفحة غير متاحة"
        description="ليست لديك صلاحية الوصول إلى هذه الصفحة."
        actionLabel="العودة إلى الرئيسية"
        onAction={() => navigateTo('/')}
      />
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [topUps, setTopUps] = useState<TopUpRequest[] | null>(null);
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('requests');

  useEffect(() => {
    const onError = () => setLoadError('تعذر تحميل بيانات الإدارة، تأكد من الاتصال وحاول مرة أخرى.');
    const unsubscribeTopUps = subscribeToAllTopUps(setTopUps, onError);
    const unsubscribeUsers = subscribeToAllUsers(setUsers, onError);
    return () => {
      unsubscribeTopUps();
      unsubscribeUsers();
    };
  }, []);

  if (loadError) return <StatusScreen title="تعذر تحميل لوحة الإدارة" description={loadError} />;
  if (!topUps || !users) return <StatusScreen title="جاري تحميل لوحة الإدارة..." loading />;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold text-brand-300">لوحة الإدارة</p>
        <h1 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">BEKO WALLET</h1>
      </div>

      <AdminStats users={users} topUps={topUps} />

      <div className="flex flex-col gap-6">
        <div className="flex gap-2 border-b border-zinc-800">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === item.id
                  ? 'border-brand-500 text-brand-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'requests' ? <AdminRequestsTable items={topUps} /> : <AdminUsersTable users={users} />}
      </div>
    </div>
  );
}
