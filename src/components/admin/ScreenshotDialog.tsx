import { X } from 'lucide-react';

interface ScreenshotDialogProps {
  src: string;
  onClose: () => void;
}

export default function ScreenshotDialog({ src, onClose }: ScreenshotDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <button type="button" aria-label="إغلاق" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div role="dialog" aria-modal="true" aria-label="صورة الإشعار" className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 animate-fade-up">
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-100 transition-colors hover:bg-red-500"
        >
          <X className="h-4 w-4" />
        </button>
        <img src={src} alt="صورة إشعار التحويل" className="max-h-[90vh] w-full object-contain" />
      </div>
    </div>
  );
}
