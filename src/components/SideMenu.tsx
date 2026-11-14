import { useEffect } from 'react';
import {
  ChevronLeft,
  Heart,
  Home,
  LogIn,
  MessageCircle,
  ReceiptText,
  Store,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useHashRoute, navigateTo } from '@/hooks/useHashRoute';
import {
  ACCOUNT_ROUTE,
  FAVORITES_ROUTE,
  ORDERS_ROUTE,
  STORE_NAME,
} from '@/lib/config';
import { buildWhatsAppUrl } from '@/lib/format';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  hint: string;
  icon: LucideIcon;
  href: string;
  sectionId?: string;
  external?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'الرئيسية', hint: 'ارجع للصفحة الرئيسية', icon: Home, href: '#/' },
  { label: 'المتجر', hint: 'شوف الألعاب والباقات', icon: Store, href: '#/', sectionId: 'games' },
  { label: 'المحفظة', hint: 'رصيدك ونقاطك وسجل عملياتك', icon: Wallet, href: '#/', sectionId: 'wallet' },
  { label: 'طلباتي', hint: 'تابع طلباتك السابقة', icon: ReceiptText, href: `#${ORDERS_ROUTE}` },
  { label: 'المفضلة', hint: 'الألعاب اللي حفظتها', icon: Heart, href: `#${FAVORITES_ROUTE}` },
  {
    label: 'تواصل معنا',
    hint: 'كلمنا على واتساب في أي وقت',
    icon: MessageCircle,
    href: buildWhatsAppUrl(),
    external: true,
  },
  {
    label: 'تسجيل الدخول / كمل كضيف',
    hint: 'ادخل بحسابك ولا كمل كضيف',
    icon: LogIn,
    href: `#${ACCOUNT_ROUTE}`,
  },
];

const ITEM_CLASS =
  'group flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors duration-200 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50';

function scrollToSection(sectionId: string) {
  window.setTimeout(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const route = useHashRoute();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  function handleItemClick(item: MenuItem) {
    onClose();
    if (item.sectionId) {
      navigateTo('/');
      scrollToSection(item.sectionId);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${
        isOpen ? 'visible' : 'invisible'
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="إغلاق القائمة"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="القائمة الرئيسية"
        className={`absolute inset-y-0 start-0 flex w-[min(20rem,85vw)] flex-col border-s border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/IMG_20261112_165719.jpg"
              alt=""
              className="h-10 w-10 rounded-xl object-cover ring-1 ring-brand-500/40"
            />
            <span className="text-sm font-bold text-zinc-50">{STORE_NAME}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
            aria-label="إغلاق القائمة"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="القائمة">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = !item.external && !item.sectionId && item.href === `#${route}`;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                tabIndex={isOpen ? 0 : -1}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => {
                  if (item.sectionId) event.preventDefault();
                  handleItemClick(item);
                }}
                className={`${ITEM_CLASS} ${isActive ? 'bg-brand-500/10' : ''}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-zinc-900 text-brand-300 group-hover:bg-brand-600 group-hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-bold text-zinc-50">{item.label}</span>
                  <span className="truncate text-xs text-zinc-400">{item.hint}</span>
                </span>
                <ChevronLeft className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-brand-300" />
              </a>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 px-5 py-4 text-center text-xs text-zinc-500">
          شحن سريع وآمن لكل الألعاب
        </div>
      </aside>
    </div>
  );
}
