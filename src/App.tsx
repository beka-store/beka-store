import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusScreen from '@/components/StatusScreen';
import CompleteProfileModal from '@/components/wallet/CompleteProfileModal';
import AccountPage from '@/pages/AccountPage';
import AdminPage from '@/pages/AdminPage';
import GamePage from '@/pages/GamePage';
import HomePage from '@/pages/HomePage';
import { ACCOUNT_ROUTE, ADMIN_ROUTE, STORE_NAME } from '@/lib/config';
import { useAuth } from '@/hooks/useAuth';
import { useCatalog } from '@/hooks/useCatalog';
import { navigateTo, useHashRoute } from '@/hooks/useHashRoute';

const GAME_ROUTE = /^\/game\/([^/]+)$/;

export default function App() {
  const route = useHashRoute();
  const { profile } = useAuth();
  const { catalog, error, isLoading, reload } = useCatalog();

  useEffect(() => {
    document.title = STORE_NAME;
  }, []);

  let content;
  if (route === ACCOUNT_ROUTE) {
    content = <AccountPage />;
  } else if (route === ADMIN_ROUTE) {
    content = <AdminPage />;
  } else if (isLoading) {
    content = <StatusScreen title="جاري تحميل الألعاب..." loading />;
  } else if (error || !catalog) {
    content = (
      <StatusScreen
        title="تعذر تحميل بيكا ستور"
        description="حدث خطأ أثناء الاتصال، حاول مرة أخرى."
        actionLabel="إعادة المحاولة"
        onAction={reload}
      />
    );
  } else {
    const gameMatch = route.match(GAME_ROUTE);
    if (gameMatch) {
      const gameId = decodeURIComponent(gameMatch[1]);
      const game = catalog.games.find((item) => item.id === gameId);
      if (!game) {
        content = (
          <StatusScreen
            title="اللعبة غير موجودة"
            description="ربما تم إيقافها أو الرابط غير صحيح."
            actionLabel="العودة إلى الألعاب"
            onAction={() => navigateTo('/')}
          />
        );
      } else {
        content = (
          <GamePage
            game={game}
            packages={catalog.packages
              .filter((pkg) => pkg.game_id === game.id)
              .sort((a, b) => a.sort_order - b.sort_order)}
            paymentMethods={catalog.paymentMethods}
          />
        );
      }
    } else {
      content = <HomePage games={catalog.games} packages={catalog.packages} />;
    }
  }

  const needsProfileDetails = profile && (!profile.name?.trim() || !profile.phone);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Header />
      <main className="flex-1">{content}</main>
      <Footer />
      {needsProfileDetails && <CompleteProfileModal profile={profile} />}
    </div>
  );
}
