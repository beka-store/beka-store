import { MessageCircle } from 'lucide-react';
import { STORE_CONTACT_DISPLAY, STORE_NAME } from '@/lib/config';
import { buildWhatsAppUrl } from '@/lib/format';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6">
        <h2 className="text-xl font-bold text-zinc-50 sm:text-2xl">هل تحتاج مساعدة؟</h2>
        <p className="max-w-md text-sm text-zinc-400">
          فريقنا جاهز للرد على استفساراتك عبر واتساب في أي وقت.
        </p>
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-600/30 active:translate-y-0"
        >
          <MessageCircle className="h-4 w-4" />
          تواصل معنا عبر واتساب
        </a>
        <p dir="ltr" className="text-sm font-semibold tracking-wide text-zinc-300">{STORE_CONTACT_DISPLAY}</p>
        <p className="text-xs text-zinc-500">© {new Date().getFullYear()} {STORE_NAME}</p>
      </div>
    </footer>
  );
}
