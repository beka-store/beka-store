import { useEffect, useId, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

interface ReceiptUploadProps {
  file: File | null;
  error: string | null;
  onChange: (file: File | null) => void;
}

export default function ReceiptUpload({ file, error, onChange }: ReceiptUploadProps) {
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-zinc-200">صورة إشعار التحويل</span>

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
          <img src={previewUrl} alt="معاينة الإشعار" className="max-h-64 w-full object-contain" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="إزالة الصورة"
            className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-100 transition-colors hover:bg-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors duration-200 hover:border-brand-500 hover:bg-brand-500/5 ${
            error ? 'border-red-500/60' : 'border-zinc-700'
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-brand-300">
            <ImagePlus className="h-6 w-6" />
          </span>
          <span className="text-sm font-semibold text-zinc-200">اضغط لرفع صورة الإشعار</span>
          <span className="text-xs text-zinc-500">JPG أو PNG أو WebP، حتى 5 ميجابايت</span>
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          onChange(event.target.files?.[0] ?? null);
          event.target.value = '';
        }}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
